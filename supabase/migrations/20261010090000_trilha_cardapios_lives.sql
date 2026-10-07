create or replace function public.dia_atual_de(p_inicio timestamptz, p_agora timestamptz)
returns integer
language sql
immutable
as $$
  select ((p_agora at time zone 'America/Sao_Paulo')::date - (p_inicio at time zone 'America/Sao_Paulo')::date) + 1;
$$;

create or replace function public.dia_de_acesso()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select public.dia_atual_de(acesso_inicio_em, now())
  from public.perfis
  where id = auth.uid() and public.tem_acesso_ativo();
$$;

alter table public.temas
  add column tipo text not null default 'tema' check (tipo in ('preparacao', 'tema')),
  add column chave text unique check (chave in ('preparacao', 'emagrecimento', 'composicao', 'lipedema', 'menopausa', 'ganho_massa'));
create unique index temas_uma_preparacao on public.temas (tipo) where tipo = 'preparacao';

alter table public.etapas
  add column chave text check (chave in ('preparacao', 'arrancada', 'constancia', 'manutencao'));

insert into public.temas (titulo, descricao, ordem, publicado, tipo, chave) values
  ('Preparação', 'Sete aulas para começar com o pé direito, uma por dia.', 0, true, 'preparacao', 'preparacao'),
  ('Emagrecimento', 'Perder peso com comida de verdade e constância.', 1, true, 'tema', 'emagrecimento'),
  ('Composição corporal', 'Menos gordura, mais músculo, no seu ritmo.', 2, true, 'tema', 'composicao'),
  ('Lipedema', 'Alimentação e movimento pensados para quem tem lipedema.', 3, true, 'tema', 'lipedema'),
  ('Menopausa', 'Cuidar do corpo e da energia nessa nova fase.', 4, true, 'tema', 'menopausa'),
  ('Ganho de massa', 'Ganhar força e massa muscular com segurança.', 5, true, 'tema', 'ganho_massa');

insert into public.etapas (tema_id, titulo, ordem, publicado, chave)
select t.id, 'Preparação', 1, true, 'preparacao' from public.temas t where t.chave = 'preparacao';

insert into public.etapas (tema_id, titulo, ordem, publicado, chave)
select t.id, e.titulo, e.ordem, true, e.chave
from public.temas t
cross join (values ('Arrancada', 1, 'arrancada'), ('Constância', 2, 'constancia'), ('Manutenção', 3, 'manutencao')) as e(titulo, ordem, chave)
where t.tipo = 'tema' and t.chave is not null;

alter table public.perfis add column tema_atual_id uuid references public.temas (id) on delete set null;

create table public.etapas_iniciadas (
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  etapa_id uuid not null references public.etapas (id) on delete cascade,
  iniciada_em date not null default public.hoje_brasilia(),
  primary key (perfil_id, etapa_id)
);

alter table public.etapas_iniciadas enable row level security;
revoke all on public.etapas_iniciadas from anon, authenticated;
grant select on public.etapas_iniciadas to authenticated;
create policy "etapas_iniciadas: dona e admin leem" on public.etapas_iniciadas
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());

create or replace function public.aula_liberada(p_aula uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select case
      when t.tipo = 'preparacao' then a.dia_liberacao <= coalesce(public.dia_de_acesso(), 0)
      else exists (
        select 1 from public.etapas_iniciadas ei
        where ei.perfil_id = auth.uid() and ei.etapa_id = a.etapa_id
          and (public.hoje_brasilia() - ei.iniciada_em) + 1 >= a.dia_liberacao
      )
    end
    from public.aulas a
    join public.etapas e on e.id = a.etapa_id
    join public.temas t on t.id = e.tema_id
    where a.id = p_aula and a.publicado and e.publicado and t.publicado and public.tem_acesso_ativo()
  ), false);
$$;

drop policy "aulas: aluna lê liberadas" on public.aulas;
create policy "aulas: aluna lê liberadas" on public.aulas
  for select to authenticated using (public.aula_liberada(id));

create or replace function public.etapa_pode_avancar(p_perfil uuid, p_etapa uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  with base as (
    select ei.iniciada_em,
      (select count(*) from public.aulas a where a.etapa_id = p_etapa and a.publicado) as total,
      (select count(*) from public.aulas a join public.aulas_concluidas c on c.aula_id = a.id and c.perfil_id = p_perfil
        where a.etapa_id = p_etapa and a.publicado) as feitas
    from public.etapas_iniciadas ei
    where ei.perfil_id = p_perfil and ei.etapa_id = p_etapa
  )
  select coalesce((
    select total > 0 and feitas * 10 >= total * 8 and (public.hoje_brasilia() - iniciada_em) + 1 >= 30
    from base
  ), false);
$$;

create or replace function public.atualizar_etapas(p_perfil uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tema uuid;
  v_etapa record;
  v_anterior uuid;
begin
  select tema_atual_id into v_tema from public.perfis where id = p_perfil;
  if v_tema is null then
    return;
  end if;
  for v_etapa in
    select e.id from public.etapas e where e.tema_id = v_tema and e.publicado order by e.ordem
  loop
    if v_anterior is null then
      insert into public.etapas_iniciadas (perfil_id, etapa_id) values (p_perfil, v_etapa.id) on conflict do nothing;
    elsif public.etapa_pode_avancar(p_perfil, v_anterior) then
      insert into public.etapas_iniciadas (perfil_id, etapa_id) values (p_perfil, v_etapa.id) on conflict do nothing;
    else
      exit;
    end if;
    v_anterior := v_etapa.id;
  end loop;
end;
$$;

create or replace function public.aulas_da_etapa(p_etapa uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'titulo', a.titulo, 'profissional', a.profissional, 'duracao_minutos', a.duracao_minutos,
    'dia_liberacao', a.dia_liberacao, 'ordem', a.ordem, 'liberada', public.aula_liberada(a.id),
    'concluida', exists (select 1 from public.aulas_concluidas c where c.aula_id = a.id and c.perfil_id = auth.uid())
  ) order by a.dia_liberacao, a.ordem, a.created_at), '[]'::jsonb)
  from public.aulas a
  where a.etapa_id = p_etapa and a.publicado;
$$;

create or replace function public.trilha_aluna()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tema uuid;
begin
  if not public.tem_acesso_ativo() then
    return jsonb_build_object('dia', null);
  end if;
  perform public.atualizar_etapas(auth.uid());
  select tema_atual_id into v_tema from public.perfis where id = auth.uid();
  return jsonb_build_object(
    'dia', public.dia_de_acesso(),
    'tema_atual', v_tema,
    'temas', (
      select coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'chave', t.chave, 'titulo', t.titulo, 'frase', t.descricao) order by t.ordem), '[]'::jsonb)
      from public.temas t where t.tipo = 'tema' and t.publicado
    ),
    'preparacao', (
      select coalesce(jsonb_agg(x.aula order by x.ord), '[]'::jsonb) from (
        select a.value as aula, a.ordinality as ord
        from public.etapas e join public.temas t on t.id = e.tema_id,
          jsonb_array_elements(public.aulas_da_etapa(e.id)) with ordinality as a
        where t.tipo = 'preparacao' and t.publicado and e.publicado
      ) x
    ),
    'etapas', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', e.id, 'chave', e.chave, 'titulo', e.titulo, 'ordem', e.ordem,
        'iniciada_em', ei.iniciada_em,
        'dia_na_etapa', case when ei.iniciada_em is null then null else (public.hoje_brasilia() - ei.iniciada_em) + 1 end,
        'aulas', public.aulas_da_etapa(e.id)
      ) order by e.ordem), '[]'::jsonb)
      from public.etapas e
      left join public.etapas_iniciadas ei on ei.etapa_id = e.id and ei.perfil_id = auth.uid()
      where e.tema_id = v_tema and e.publicado
    )
  );
end;
$$;

create or replace function public.escolher_tema(p_tema uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.tem_acesso_ativo() then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  if coalesce(public.dia_de_acesso(), 0) < 8 then
    raise exception 'a escolha do tema libera no dia 8' using errcode = '22023';
  end if;
  if not exists (select 1 from public.temas where id = p_tema and tipo = 'tema' and publicado) then
    raise exception 'tema inválido' using errcode = '22023';
  end if;
  update public.perfis set tema_atual_id = p_tema where id = auth.uid();
  perform public.atualizar_etapas(auth.uid());
end;
$$;

drop function public.minha_trilha();

create table public.comece_aqui (
  id boolean primary key default true check (id),
  video_url text check (video_url ~ '^https://'),
  texto text not null default '' check (char_length(texto) <= 5000),
  updated_at timestamptz not null default now()
);
insert into public.comece_aqui (texto) values ('Que bom ter você aqui. Assista ao vídeo e marque cada passo abaixo para deixar tudo pronto.');
create trigger comece_aqui_updated_at before update on public.comece_aqui for each row execute function public.tocar_updated_at();

create table public.comece_aqui_feitos (
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  item text not null check (item in ('perfil', 'medidas', 'foto', 'regras', 'app')),
  created_at timestamptz not null default now(),
  primary key (perfil_id, item)
);

alter table public.comece_aqui enable row level security;
alter table public.comece_aqui_feitos enable row level security;
revoke all on public.comece_aqui, public.comece_aqui_feitos from anon, authenticated;
grant select, update on public.comece_aqui to authenticated;
grant select, insert, delete on public.comece_aqui_feitos to authenticated;

create policy "comece_aqui: quem tem acesso lê" on public.comece_aqui
  for select to authenticated using (public.eh_admin() or public.tem_acesso_ativo());
create policy "comece_aqui: admin edita" on public.comece_aqui
  for update to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "comece_feitos: dona e admin leem" on public.comece_aqui_feitos
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "comece_feitos: dona marca" on public.comece_aqui_feitos
  for insert to authenticated with check (perfil_id = auth.uid() and public.tem_acesso_ativo());
create policy "comece_feitos: dona desmarca" on public.comece_aqui_feitos
  for delete to authenticated using (perfil_id = auth.uid());

alter table public.lives
  add column profissional text check (profissional in ('ana', 'clara', 'lais')),
  add column duracao_minutos integer not null default 60 check (duracao_minutos between 15 and 300);

create table public.lives_presencas (
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  live_id uuid not null references public.lives (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (perfil_id, live_id)
);

create table public.lives_lembretes (
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  live_id uuid not null references public.lives (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (perfil_id, live_id)
);

alter table public.lives_presencas enable row level security;
alter table public.lives_lembretes enable row level security;
revoke all on public.lives_presencas, public.lives_lembretes from anon, authenticated;
grant select on public.lives_presencas to authenticated;
grant select, insert, delete on public.lives_lembretes to authenticated;

create policy "presencas: dona e admin leem" on public.lives_presencas
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "lembretes: dona lê" on public.lives_lembretes
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "lembretes: dona liga" on public.lives_lembretes
  for insert to authenticated with check (
    perfil_id = auth.uid() and public.tem_acesso_ativo()
    and exists (select 1 from public.lives l where l.id = live_id and l.publicado)
  );
create policy "lembretes: dona desliga" on public.lives_lembretes
  for delete to authenticated using (perfil_id = auth.uid());

create or replace function public.entrar_live(p_live uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_live public.lives;
  v_lanc uuid;
begin
  if not public.tem_acesso_ativo() then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  select * into v_live from public.lives where id = p_live and publicado;
  if not found then
    raise exception 'live não encontrada' using errcode = 'P0002';
  end if;
  if now() < v_live.data - interval '30 minutes' or now() > v_live.data + make_interval(mins => v_live.duracao_minutos) then
    raise exception 'fora do horário da live' using errcode = '22023';
  end if;
  insert into public.lives_presencas (perfil_id, live_id) values (auth.uid(), p_live) on conflict do nothing;
  v_lanc := public.conceder_pontos(auth.uid(), 'live', 'live', p_live::text);
  return jsonb_build_object(
    'link', v_live.link_url,
    'pontos', coalesce((select l.pontos from public.lancamentos_pontos l where l.id = v_lanc), 0)
  );
end;
$$;

alter table public.receitas
  add column tempo_minutos integer check (tempo_minutos between 1 and 1440),
  add column refeicoes text[] not null default '{}' check (refeicoes <@ array['cafe', 'lanche', 'almoco', 'jantar', 'ceia', 'pre_treino', 'pos_treino']),
  add column objetivos text[] not null default '{}' check (objetivos <@ array['Emagrecimento', 'Composição corporal', 'Lipedema', 'Menopausa', 'Ganho de massa']);

create table public.receitas_favoritas (
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  receita_id uuid not null references public.receitas (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (perfil_id, receita_id)
);

create table public.lista_compras_marcados (
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  cardapio_id uuid not null references public.cardapios (id) on delete cascade,
  item text not null check (char_length(item) between 1 and 200),
  created_at timestamptz not null default now(),
  primary key (perfil_id, cardapio_id, item)
);

alter table public.receitas_favoritas enable row level security;
alter table public.lista_compras_marcados enable row level security;
revoke all on public.receitas_favoritas, public.lista_compras_marcados from anon, authenticated;
grant select, insert, delete on public.receitas_favoritas, public.lista_compras_marcados to authenticated;

create policy "favoritas: dona lê" on public.receitas_favoritas
  for select to authenticated using (perfil_id = auth.uid());
create policy "favoritas: dona marca" on public.receitas_favoritas
  for insert to authenticated with check (
    perfil_id = auth.uid() and public.tem_acesso_ativo()
    and exists (select 1 from public.receitas r where r.id = receita_id and r.publicado)
  );
create policy "favoritas: dona desmarca" on public.receitas_favoritas
  for delete to authenticated using (perfil_id = auth.uid());

create policy "lista: dona lê" on public.lista_compras_marcados
  for select to authenticated using (perfil_id = auth.uid());
create policy "lista: dona marca" on public.lista_compras_marcados
  for insert to authenticated with check (
    perfil_id = auth.uid() and public.tem_acesso_ativo()
    and exists (select 1 from public.cardapios c where c.id = cardapio_id and c.publicado)
  );
create policy "lista: dona desmarca" on public.lista_compras_marcados
  for delete to authenticated using (perfil_id = auth.uid());

revoke all on function public.dia_atual_de(timestamptz, timestamptz), public.aula_liberada(uuid), public.etapa_pode_avancar(uuid, uuid),
  public.atualizar_etapas(uuid), public.aulas_da_etapa(uuid), public.trilha_aluna(), public.escolher_tema(uuid), public.entrar_live(uuid) from public, anon;
revoke all on function public.etapa_pode_avancar(uuid, uuid), public.atualizar_etapas(uuid) from authenticated;
grant execute on function public.dia_atual_de(timestamptz, timestamptz), public.aula_liberada(uuid), public.aulas_da_etapa(uuid),
  public.trilha_aluna(), public.escolher_tema(uuid), public.entrar_live(uuid) to authenticated;
