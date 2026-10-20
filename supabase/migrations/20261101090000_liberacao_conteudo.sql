alter table public.temas
  add column bloqueado boolean not null default false,
  add column libera_em timestamptz;
alter table public.aulas
  add column bloqueado boolean not null default false,
  add column libera_em timestamptz;

create or replace function public.fechado(p_bloqueado boolean, p_libera_em timestamptz)
returns boolean
language sql
stable
set search_path = public
as $$
  select coalesce(p_bloqueado, false) or (p_libera_em is not null and p_libera_em > now());
$$;

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
      and not public.fechado(a.bloqueado, a.libera_em) and not public.fechado(t.bloqueado, t.libera_em)
  ), false);
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
    'em_breve', public.fechado(a.bloqueado, a.libera_em) or public.fechado(t.bloqueado, t.libera_em),
    'concluida', exists (select 1 from public.aulas_concluidas c where c.aula_id = a.id and c.perfil_id = auth.uid())
  ) order by a.dia_liberacao, a.ordem, a.created_at), '[]'::jsonb)
  from public.aulas a
  join public.etapas e on e.id = a.etapa_id
  join public.temas t on t.id = e.tema_id
  where a.etapa_id = p_etapa and a.publicado;
$$;

create or replace function public.aulas_previa(p_etapa uuid, p_dia integer)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'titulo', a.titulo, 'profissional', a.profissional, 'duracao_minutos', a.duracao_minutos,
    'dia_liberacao', a.dia_liberacao, 'ordem', a.ordem,
    'liberada', p_dia is not null and a.dia_liberacao <= p_dia
      and not public.fechado(a.bloqueado, a.libera_em) and not public.fechado(t.bloqueado, t.libera_em),
    'em_breve', public.fechado(a.bloqueado, a.libera_em) or public.fechado(t.bloqueado, t.libera_em),
    'concluida', false
  ) order by a.dia_liberacao, a.ordem, a.created_at), '[]'::jsonb)
  from public.aulas a
  join public.etapas e on e.id = a.etapa_id
  join public.temas t on t.id = e.tema_id
  where a.etapa_id = p_etapa and a.publicado;
$$;
revoke all on function public.aulas_previa(uuid, integer) from public, anon, authenticated;

create or replace function public.temas_da_trilha()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'chave', t.chave, 'cor', t.cor, 'titulo', t.titulo, 'frase', t.descricao,
    'em_breve', public.fechado(t.bloqueado, t.libera_em)
  ) order by t.ordem), '[]'::jsonb)
  from public.temas t where t.tipo = 'tema' and t.publicado;
$$;
revoke all on function public.temas_da_trilha() from public, anon, authenticated;

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
    'temas', public.temas_da_trilha(),
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

create or replace function public.trilha_previa(p_dia integer, p_tema uuid default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tema uuid := case when p_dia >= 8 then p_tema end;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if p_dia not between 1 and 365 then
    raise exception 'dia fora de 1 a 365' using errcode = '22023';
  end if;
  return jsonb_build_object(
    'dia', p_dia,
    'tema_atual', v_tema,
    'temas', public.temas_da_trilha(),
    'preparacao', (
      select coalesce(jsonb_agg(x.aula order by x.ord), '[]'::jsonb) from (
        select a.value as aula, a.ordinality as ord
        from public.etapas e join public.temas t on t.id = e.tema_id,
          jsonb_array_elements(public.aulas_previa(e.id, p_dia)) with ordinality as a
        where t.tipo = 'preparacao' and t.publicado and e.publicado
      ) x
    ),
    'etapas', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', e.id, 'chave', e.chave, 'titulo', e.titulo, 'ordem', e.ordem,
        'iniciada_em', case when p_dia >= e.inicio then public.hoje_brasilia() - (p_dia - e.inicio) end,
        'dia_na_etapa', case when p_dia >= e.inicio then p_dia - e.inicio + 1 end,
        'aulas', public.aulas_previa(e.id, case when p_dia >= e.inicio then p_dia - e.inicio + 1 end)
      ) order by e.ordem), '[]'::jsonb)
      from (
        select x.*, 8 + 30 * (row_number() over (order by x.ordem) - 1)::integer as inicio
        from public.etapas x where x.tema_id = v_tema and x.publicado
      ) e
      join public.temas t on t.id = e.tema_id and t.publicado
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
  if not exists (
    select 1 from public.temas
    where id = p_tema and tipo = 'tema' and publicado and not public.fechado(bloqueado, libera_em)
  ) then
    raise exception 'tema inválido' using errcode = '22023';
  end if;
  update public.perfis set tema_atual_id = p_tema where id = auth.uid();
  perform public.atualizar_etapas(auth.uid());
end;
$$;

create or replace function public.etapa_pode_avancar(p_perfil uuid, p_etapa uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  with abertas as (
    select a.id from public.aulas a
    where a.etapa_id = p_etapa and a.publicado and not public.fechado(a.bloqueado, a.libera_em)
  ),
  base as (
    select ei.iniciada_em,
      (select count(*) from abertas) as total,
      (select count(*) from abertas x join public.aulas_concluidas c on c.aula_id = x.id and c.perfil_id = p_perfil) as feitas
    from public.etapas_iniciadas ei
    where ei.perfil_id = p_perfil and ei.etapa_id = p_etapa
  )
  select coalesce((
    select total > 0 and feitas * 10 >= total * 8 and (public.hoje_brasilia() - iniciada_em) + 1 >= 30
    from base
  ), false);
$$;
revoke all on function public.etapa_pode_avancar(uuid, uuid) from public, anon, authenticated;

create or replace function public.ordenar_temas(p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if p_ids is null or cardinality(p_ids) <> (select count(*) from public.temas)
    or cardinality(p_ids) <> (select count(distinct x) from unnest(p_ids) x)
    or exists (select 1 from unnest(p_ids) x where not exists (select 1 from public.temas t where t.id = x)) then
    raise exception 'lista de temas inválida' using errcode = '22023';
  end if;
  update public.temas t set ordem = l.pos
  from unnest(p_ids) with ordinality as l(id, pos)
  where t.id = l.id and t.ordem <> l.pos;
end;
$$;
revoke all on function public.ordenar_temas(uuid[]) from public, anon;
grant execute on function public.ordenar_temas(uuid[]) to authenticated;

create table public.comece_materiais (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('pdf', 'imagem', 'word', 'link')),
  caminho text not null check (char_length(caminho) between 1 and 500),
  nome text not null check (char_length(nome) between 1 and 160),
  tamanho bigint check (tamanho between 0 and 20971520),
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  check ((tipo = 'link') = (caminho ~ '^https://')),
  check (tipo = 'link' or caminho like 'comece/%')
);
alter table public.comece_materiais enable row level security;
revoke all on public.comece_materiais from anon, authenticated;
grant select, insert, update, delete on public.comece_materiais to authenticated;
create policy "comece materiais: admin gerencia" on public.comece_materiais
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "comece materiais: quem tem acesso lê" on public.comece_materiais
  for select to authenticated using (public.tem_acesso_ativo());

create or replace function public.salvar_materiais_comece(p_itens jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  delete from public.comece_materiais where true;
  insert into public.comece_materiais (tipo, caminho, nome, tamanho, ordem)
  select i ->> 'tipo', i ->> 'caminho', left(trim(i ->> 'nome'), 160), nullif(i ->> 'tamanho', '')::bigint, (ordinality - 1)::integer
  from jsonb_array_elements(coalesce(p_itens, '[]'::jsonb)) with ordinality as e(i, ordinality);
end;
$$;
revoke all on function public.salvar_materiais_comece(jsonb) from public, anon;
grant execute on function public.salvar_materiais_comece(jsonb) to authenticated;
