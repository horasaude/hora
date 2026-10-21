alter table public.temas add column dias_liberado integer not null default 30 check (dias_liberado between 1 and 365);

update public.temas set tipo = 'tema', titulo = 'Detox', dias_liberado = 7 where tipo = 'preparacao';

update public.temas t set ordem = l.pos
from (select id, row_number() over (order by ordem, created_at, id) as pos from public.temas) l
where l.id = t.id and t.ordem <> l.pos;

with fica as (
  select distinct on (tema_id) id, tema_id from public.etapas order by tema_id, ordem, created_at, id
)
update public.aulas a set etapa_id = f.id
from public.etapas e join fica f on f.tema_id = e.tema_id
where a.etapa_id = e.id and e.id <> f.id;

delete from public.etapas e
where e.id not in (select distinct on (tema_id) id from public.etapas order by tema_id, ordem, created_at, id);

update public.etapas set titulo = 'Aulas', publicado = true, ordem = 1;

insert into public.etapas (tema_id, titulo, ordem, publicado)
select t.id, 'Aulas', 1, true from public.temas t
where not exists (select 1 from public.etapas e where e.tema_id = t.id);

create or replace function public.etapa_do_tema(p_tema uuid)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_id uuid;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  select id into v_id from public.etapas where tema_id = p_tema order by ordem, created_at limit 1;
  if v_id is null then
    insert into public.etapas (tema_id, titulo, ordem, publicado) values (p_tema, 'Aulas', 1, true)
    returning id into v_id;
  end if;
  return v_id;
end;
$$;
revoke all on function public.etapa_do_tema(uuid) from public, anon;
grant execute on function public.etapa_do_tema(uuid) to authenticated;

create or replace function public.inicio_do_tema(p_tema uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  with s as (
    select id, 1 + coalesce(sum(dias_liberado) over (
      order by ordem, created_at, id rows between unbounded preceding and 1 preceding), 0) as inicio
    from public.temas where publicado
  )
  select inicio::integer from s where id = p_tema;
$$;

create or replace function public.tema_aberto(p_tema uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select t.publicado and not public.fechado(t.bloqueado, t.libera_em)
      and coalesce(public.dia_de_acesso(), 0) >= public.inicio_do_tema(t.id)
    from public.temas t where t.id = p_tema
  ), false);
$$;

create or replace function public.aula_liberada(p_aula uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select a.publicado and not public.fechado(a.bloqueado, a.libera_em) and public.tema_aberto(e.tema_id)
    from public.aulas a join public.etapas e on e.id = a.etapa_id
    where a.id = p_aula
  ), false);
$$;

create or replace function public.aulas_do_tema(p_tema uuid, p_aberto boolean, p_aluna boolean)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'titulo', a.titulo, 'profissional', a.profissional, 'duracao_minutos', a.duracao_minutos,
    'dia_liberacao', a.dia_liberacao, 'ordem', a.ordem, 'capa', a.capa_path,
    'liberada', p_aberto and not public.fechado(a.bloqueado, a.libera_em),
    'em_breve', public.fechado(a.bloqueado, a.libera_em),
    'concluida', p_aluna and exists (
      select 1 from public.aulas_concluidas c where c.aula_id = a.id and c.perfil_id = auth.uid())
  ) order by e.ordem, a.ordem, a.created_at), '[]'::jsonb)
  from public.aulas a join public.etapas e on e.id = a.etapa_id
  where e.tema_id = p_tema and a.publicado;
$$;
revoke all on function public.aulas_do_tema(uuid, boolean, boolean) from public, anon, authenticated;

create or replace function public.temas_em_sequencia(p_dia integer, p_aluna boolean)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', x.id, 'chave', x.chave, 'cor', x.cor, 'titulo', x.titulo, 'frase', x.descricao, 'capa', x.capa_path,
    'inicio', x.inicio, 'dias', x.dias_liberado,
    'aberto', x.aberto, 'em_breve', x.fechado,
    'aulas', public.aulas_do_tema(x.id, x.aberto, p_aluna)
  ) order by x.ordem, x.created_at), '[]'::jsonb)
  from (
    select t.*, public.inicio_do_tema(t.id) as inicio, public.fechado(t.bloqueado, t.libera_em) as fechado,
      coalesce(p_dia, 0) >= public.inicio_do_tema(t.id) and not public.fechado(t.bloqueado, t.libera_em) as aberto
    from public.temas t where t.publicado
  ) x;
$$;
revoke all on function public.temas_em_sequencia(integer, boolean) from public, anon, authenticated;

create or replace function public.trilha_aluna()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.tem_acesso_ativo() then
    return jsonb_build_object('dia', null);
  end if;
  return jsonb_build_object(
    'dia', public.dia_de_acesso(),
    'temas', public.temas_em_sequencia(public.dia_de_acesso(), true)
  );
end;
$$;

create or replace function public.trilha_previa(p_dia integer, p_tema uuid default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if p_dia not between 1 and 365 then
    raise exception 'dia fora de 1 a 365' using errcode = '22023';
  end if;
  return jsonb_build_object('dia', p_dia, 'temas', public.temas_em_sequencia(p_dia, false));
end;
$$;

create or replace function public.etapa_pode_avancar(p_perfil uuid, p_etapa uuid)
returns boolean
language sql
stable
as $$
  select false;
$$;

create or replace function public.atualizar_etapas(p_perfil uuid)
returns void
language sql
as $$
  select;
$$;
revoke all on function public.etapa_pode_avancar(uuid, uuid), public.atualizar_etapas(uuid) from public, anon, authenticated;

create or replace function public.escolher_tema(p_tema uuid)
returns void
language plpgsql
as $$
begin
  raise exception 'a trilha segue a sequência de temas' using errcode = '22023';
end;
$$;

alter table public.cardapios add column tema_id uuid references public.temas (id) on delete set null;
update public.cardapios c set tema_id = t.id
from public.temas t
where c.tema_id is null and (t.titulo = c.objetivo or (c.objetivo = 'Preparação' and t.chave = 'preparacao'));
create index cardapios_tema_idx on public.cardapios (tema_id);

alter table public.cardapios drop constraint cardapios_objetivo_valido;

create or replace function public.cardapio_tema_do_objetivo()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.tema_id is not null and (tg_op = 'INSERT' or new.tema_id is distinct from old.tema_id) then
    select left(t.titulo, 80) into new.objetivo from public.temas t where t.id = new.tema_id;
  elsif new.objetivo is not null and (tg_op = 'INSERT' or new.objetivo is distinct from old.objetivo or new.tema_id is null) then
    select t.id into new.tema_id from public.temas t
    where t.titulo = new.objetivo or (new.objetivo = 'Preparação' and t.chave = 'preparacao')
    order by t.ordem limit 1;
  end if;
  return new;
end;
$$;
create trigger cardapios_tema_do_objetivo before insert or update on public.cardapios
  for each row execute function public.cardapio_tema_do_objetivo();

drop policy "cardapios: aluna lê publicados do seu tema" on public.cardapios;
create policy "cardapios: aluna lê publicados dos temas abertos" on public.cardapios
  for select to authenticated using (publicado and public.tema_aberto(tema_id));

create or replace function public.treino_visivel(p_treino uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.treinos t
    where t.id = p_treino and t.publicado and public.tema_aberto(t.tema_id)
  );
$$;

drop policy "rotinas: aluna lê publicadas do tema dela" on public.rotinas;
create policy "rotinas: aluna lê publicadas dos temas abertos" on public.rotinas
  for select to authenticated using (publicado and public.tema_aberto(tema_id));
drop policy "rotina_treinos: aluna lê os da rotina visível" on public.rotina_treinos;
create policy "rotina_treinos: aluna lê os da rotina visível" on public.rotina_treinos
  for select to authenticated using (
    public.treino_visivel(treino_id) and exists (
      select 1 from public.rotinas r where r.id = rotina_id and r.publicado and public.tema_aberto(r.tema_id)
    )
  );

alter table public.desafios add column tema_id uuid references public.temas (id) on delete set null;
create index desafios_tema_idx on public.desafios (tema_id);

create or replace function public.janela_desafio(p_desafio uuid)
returns table (inicio date, fim date)
language sql
stable
security definer
set search_path = public
as $$
  select
    case when d.tema_id is null then d.inicio
      else (p.acesso_inicio_em at time zone 'America/Sao_Paulo')::date + public.inicio_do_tema(d.tema_id) - 1 end,
    case when d.tema_id is null then d.fim
      else (p.acesso_inicio_em at time zone 'America/Sao_Paulo')::date + public.inicio_do_tema(d.tema_id) - 1
        + (select t.dias_liberado from public.temas t where t.id = d.tema_id) - 1 end
  from public.desafios d left join public.perfis p on p.id = auth.uid()
  where d.id = p_desafio;
$$;
revoke all on function public.janela_desafio(uuid) from public, anon, authenticated;

drop function public.meus_desafios();
create function public.meus_desafios()
returns table (
  id uuid, tema_id uuid, nome text, descricao text, inicio date, fim date, tipo_checkin text, unidade text,
  meta_diaria integer, meta_dias integer, pontos_por_dia integer, bonus_conclusao integer,
  premio text, premio_surpresa boolean, encerrado boolean, participando boolean,
  participantes integer, dias_feitos integer, feito_hoje boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select d.id, d.tema_id, d.nome, d.descricao, j.inicio, j.fim, d.tipo_checkin::text, d.unidade,
    d.meta_diaria, d.meta_dias, d.pontos_por_dia, d.bonus_conclusao, d.premio, d.premio_surpresa,
    (d.encerrado_em is not null or j.fim < public.hoje_brasilia()),
    exists (select 1 from public.desafio_participantes p where p.desafio_id = d.id and p.perfil_id = auth.uid())
      or exists (select 1 from public.desafio_checkins c where c.desafio_id = d.id and c.perfil_id = auth.uid()),
    (select count(*)::integer from (
      select p.perfil_id from public.desafio_participantes p where p.desafio_id = d.id
      union
      select c.perfil_id from public.desafio_checkins c where c.desafio_id = d.id
    ) g),
    public.dias_cumpridos(d.id, auth.uid()),
    exists (select 1 from public.desafio_checkins c
      where c.desafio_id = d.id and c.perfil_id = auth.uid() and c.dia = public.hoje_brasilia())
  from public.desafios d, lateral public.janela_desafio(d.id) j
  where d.publicado and auth.uid() is not null and (public.eh_admin() or public.tem_acesso_ativo())
    and (d.tema_id is null or public.eh_admin() or public.tema_aberto(d.tema_id))
  order by j.inicio desc, d.nome;
$$;
revoke all on function public.meus_desafios() from public, anon;
grant execute on function public.meus_desafios() to authenticated;

create or replace function public.entrar_desafio(p_desafio uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.tem_acesso_ativo() then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.desafios d, public.janela_desafio(d.id) j
    where d.id = p_desafio and d.publicado and d.encerrado_em is null and public.hoje_brasilia() <= j.fim
      and (d.tema_id is null or public.tema_aberto(d.tema_id))
  ) then
    raise exception 'desafio fechado' using errcode = '22023';
  end if;
  insert into public.desafio_participantes (desafio_id, perfil_id) values (p_desafio, auth.uid())
  on conflict do nothing;
end;
$$;

create or replace function public.checkin_desafio(p_desafio uuid, p_valor integer default null, p_foto_path text default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_d public.desafios;
  v_inicio date;
  v_fim date;
begin
  if not public.tem_acesso_ativo() then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  select * into v_d from public.desafios where id = p_desafio and publicado;
  select j.inicio, j.fim into v_inicio, v_fim from public.janela_desafio(p_desafio) j;
  if not found or v_d.id is null or v_d.encerrado_em is not null
    or public.hoje_brasilia() not between v_inicio and v_fim
    or (v_d.tema_id is not null and not public.tema_aberto(v_d.tema_id)) then
    raise exception 'fora do período' using errcode = '22023';
  end if;
  if (v_d.tipo_checkin = 'numero' and (p_valor is null or p_valor < 0 or p_valor > 100000))
    or (v_d.tipo_checkin = 'foto' and p_foto_path is null) then
    raise exception 'check-in incompleto' using errcode = '22023';
  end if;
  if p_foto_path is not null and split_part(p_foto_path, '/', 1) <> auth.uid()::text then
    raise exception 'foto de outra pessoa' using errcode = '42501';
  end if;
  insert into public.desafio_participantes (desafio_id, perfil_id) values (p_desafio, auth.uid())
  on conflict do nothing;
  insert into public.desafio_checkins (desafio_id, perfil_id, valor, foto_path)
  values (p_desafio, auth.uid(), case when v_d.tipo_checkin = 'numero' then p_valor end, p_foto_path)
  on conflict do nothing;
  if not found then
    return 0;
  end if;
  return coalesce((
    select sum(l.pontos)::integer from public.lancamentos_pontos l
    where l.perfil_id = auth.uid() and l.origem = 'desafio' and l.created_at = now()
  ), 0);
end;
$$;

create table public.tema_materiais (
  id uuid primary key default gen_random_uuid(),
  tema_id uuid not null references public.temas (id) on delete cascade,
  tipo text not null check (tipo in ('pdf', 'imagem', 'word', 'link')),
  caminho text not null check (char_length(caminho) between 1 and 500),
  nome text not null check (char_length(nome) between 1 and 160),
  tamanho bigint check (tamanho between 0 and 20971520),
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  check ((tipo = 'link') = (caminho ~ '^https://')),
  check (tipo = 'link' or caminho like 'temas/%')
);
create index tema_materiais_tema_idx on public.tema_materiais (tema_id, ordem);
alter table public.tema_materiais enable row level security;
revoke all on public.tema_materiais from anon, authenticated;
grant select, insert, update, delete on public.tema_materiais to authenticated;
create policy "tema materiais: admin gerencia" on public.tema_materiais
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "tema materiais: aluna lê os do tema aberto" on public.tema_materiais
  for select to authenticated using (public.tema_aberto(tema_id));

create or replace function public.salvar_materiais_tema(p_tema uuid, p_itens jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  delete from public.tema_materiais where tema_id = p_tema;
  insert into public.tema_materiais (tema_id, tipo, caminho, nome, tamanho, ordem)
  select p_tema, i ->> 'tipo', i ->> 'caminho', left(trim(i ->> 'nome'), 160), nullif(i ->> 'tamanho', '')::bigint, (ordinality - 1)::integer
  from jsonb_array_elements(coalesce(p_itens, '[]'::jsonb)) with ordinality as e(i, ordinality);
end;
$$;
revoke all on function public.salvar_materiais_tema(uuid, jsonb) from public, anon;
grant execute on function public.salvar_materiais_tema(uuid, jsonb) to authenticated;

grant execute on function public.inicio_do_tema(uuid), public.tema_aberto(uuid) to authenticated;

create or replace function public.pendencias_de(p_perfil uuid)
returns table (item text, nome text, para text, feito boolean, andamento boolean)
language sql
stable
security definer
set search_path = public
as $$
  with p as (
    select pf.*, public.dia_atual_de(pf.acesso_inicio_em, now()) as dia
    from public.perfis pf where pf.id = p_perfil and pf.papel = 'aluna'
  ),
  feitos as (select f.item from public.comece_aqui_feitos f where f.perfil_id = p_perfil)
  select 'anamnese:' || a.id, 'Responder a ' || lower(left(a.titulo, 1)) || substr(a.titulo, 2),
    '/app/avaliacoes/' || a.id, r.enviada_em is not null, r.perfil_id is not null and r.enviada_em is null
  from p, public.anamneses a
  left join public.anamnese_respostas r on r.anamnese_id = a.id and r.perfil_id = p_perfil
  where a.publicada
  union all
  select x.item, x.nome, '/app', x.feito, false
  from p, (values
    ('comece_perfil', 'Completar o perfil', exists (select 1 from feitos where item = 'perfil'), 1),
    ('comece_medidas', 'Registrar as medidas', exists (select 1 from public.medidas m where m.perfil_id = p_perfil), 2),
    ('comece_foto', 'Mandar a foto de antes', exists (select 1 from public.medidas m where m.perfil_id = p_perfil and m.foto_path is not null), 3),
    ('comece_regras', 'Ler as regras de pontos', exists (select 1 from feitos where item = 'regras'), 4),
    ('comece_app', 'Instalar o app no celular', exists (select 1 from feitos where item = 'app'), 5)
  ) as x(item, nome, feito, ordem)
  union all
  select 'treino', 'Escolher nível e local do treino', '/app/treinos', p.treino_nivel is not null and p.treino_local is not null, false
  from p;
$$;
