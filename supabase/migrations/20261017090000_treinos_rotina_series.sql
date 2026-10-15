alter table public.treinos drop constraint treinos_nivel_check;
alter table public.treinos add constraint treinos_nivel_check
  check (nivel in ('adaptacao', 'iniciante', 'intermediario', 'avancado'));
alter table public.rotinas drop constraint rotinas_nivel_check;
alter table public.rotinas add constraint rotinas_nivel_check
  check (nivel in ('adaptacao', 'iniciante', 'intermediario', 'avancado'));
alter table public.perfis drop constraint perfis_treino_nivel_check;
alter table public.perfis add constraint perfis_treino_nivel_check
  check (treino_nivel in ('adaptacao', 'iniciante', 'intermediario', 'avancado'));

alter table public.treinos
  add column orientacoes text not null default '' check (char_length(orientacoes) <= 3000);

alter table public.rotinas
  add column tipo text not null default 'semana' check (tipo in ('semana', 'numerico')),
  add column objetivo text check (objetivo in (
    'hipertrofia', 'reducao_gordura', 'reducao_hipertrofia', 'definicao', 'condicionamento', 'qualidade_vida'
  )),
  add column orientacoes text not null default '' check (char_length(orientacoes) <= 3000);

alter table public.rotina_treinos
  alter column dia_semana drop not null,
  add column ordem integer check (ordem between 0 and 30),
  add constraint rotina_treinos_dia_ou_ordem check ((dia_semana is null) <> (ordem is null)),
  add constraint rotina_treinos_rotina_id_ordem_key unique (rotina_id, ordem);

alter table public.treino_exercicios
  add column series_detalhe jsonb not null default '[]'::jsonb
    check (jsonb_typeof(series_detalhe) = 'array' and jsonb_array_length(series_detalhe) <= 20),
  add column alternativo_id uuid references public.exercicios (id) on delete set null;

create table public.exercicios_favoritos (
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  exercicio_id uuid not null references public.exercicios (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (perfil_id, exercicio_id)
);
alter table public.exercicios_favoritos enable row level security;
revoke all on public.exercicios_favoritos from anon, authenticated;
grant select, insert, delete on public.exercicios_favoritos to authenticated;
create policy "exercicios_favoritos: admin cuida dos seus" on public.exercicios_favoritos
  for all to authenticated
  using (perfil_id = auth.uid() and public.eh_admin())
  with check (perfil_id = auth.uid() and public.eh_admin());

drop policy "exercicios: aluna com acesso lê os dos treinos dela" on public.exercicios;
create policy "exercicios: aluna com acesso lê os dos treinos dela" on public.exercicios
  for select to authenticated using (
    public.tem_acesso_ativo() and exists (
      select 1 from public.treino_exercicios te
      where (te.exercicio_id = exercicios.id or te.alternativo_id = exercicios.id)
        and public.treino_visivel(te.treino_id)
    )
  );

create or replace function public.series_validas(p jsonb)
returns boolean
language sql
immutable
set search_path = public
as $$
  select coalesce(bool_and(
    jsonb_typeof(s) = 'object'
    and char_length(coalesce(s ->> 'repeticoes', '')) between 1 and 40
    and char_length(coalesce(s ->> 'carga', '')) <= 80
    and coalesce((s ->> 'descanso_segundos')::integer, -1) between 0 and 600
  ), true)
  from jsonb_array_elements(p) as e(s);
$$;

alter table public.treino_exercicios
  add constraint treino_exercicios_series_detalhe_validas check (public.series_validas(series_detalhe));

create or replace function public.salvar_treino(p_treino jsonb, p_itens jsonb)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_id uuid := nullif(p_treino ->> 'id', '')::uuid;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if v_id is null then
    insert into public.treinos (nome, tema_id, nivel, local, duracao_minutos, descricao, aquecimento, alongamento, orientacoes, publicado)
    values (p_treino ->> 'nome', (p_treino ->> 'tema_id')::uuid, p_treino ->> 'nivel', p_treino ->> 'local',
      nullif(p_treino ->> 'duracao_minutos', '')::integer, coalesce(p_treino ->> 'descricao', ''),
      coalesce(p_treino ->> 'aquecimento', ''), coalesce(p_treino ->> 'alongamento', ''),
      coalesce(p_treino ->> 'orientacoes', ''), coalesce((p_treino ->> 'publicado')::boolean, false))
    returning id into v_id;
  else
    update public.treinos set
      nome = p_treino ->> 'nome', tema_id = (p_treino ->> 'tema_id')::uuid, nivel = p_treino ->> 'nivel',
      local = p_treino ->> 'local', duracao_minutos = nullif(p_treino ->> 'duracao_minutos', '')::integer,
      descricao = coalesce(p_treino ->> 'descricao', ''), aquecimento = coalesce(p_treino ->> 'aquecimento', ''),
      alongamento = coalesce(p_treino ->> 'alongamento', ''), orientacoes = coalesce(p_treino ->> 'orientacoes', ''),
      publicado = coalesce((p_treino ->> 'publicado')::boolean, false)
    where id = v_id;
  end if;
  delete from public.treino_exercicios where treino_id = v_id;
  insert into public.treino_exercicios (treino_id, exercicio_id, ordem, series, repeticoes, carga, descanso_segundos,
    observacao, series_detalhe, alternativo_id)
  select v_id, (i ->> 'exercicio_id')::uuid, (ordinality - 1)::integer,
    case when jsonb_array_length(coalesce(i -> 'series_detalhe', '[]'::jsonb)) > 0
      then jsonb_array_length(i -> 'series_detalhe') else coalesce((i ->> 'series')::integer, 3) end,
    coalesce(nullif(i ->> 'repeticoes', ''), '12'), coalesce(i ->> 'carga', ''),
    coalesce((i ->> 'descanso_segundos')::integer, 60), coalesce(i ->> 'observacao', ''),
    coalesce(i -> 'series_detalhe', '[]'::jsonb), nullif(i ->> 'alternativo_id', '')::uuid
  from jsonb_array_elements(coalesce(p_itens, '[]'::jsonb)) with ordinality as e(i, ordinality);
  return v_id;
end;
$$;

create or replace function public.salvar_rotina(p_rotina jsonb, p_dias jsonb)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_id uuid := nullif(p_rotina ->> 'id', '')::uuid;
  v_tipo text := coalesce(nullif(p_rotina ->> 'tipo', ''), 'semana');
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if v_id is null then
    insert into public.rotinas (nome, tema_id, nivel, local, descricao, tipo, objetivo, orientacoes, publicado)
    values (p_rotina ->> 'nome', (p_rotina ->> 'tema_id')::uuid, p_rotina ->> 'nivel', p_rotina ->> 'local',
      coalesce(p_rotina ->> 'descricao', ''), v_tipo, nullif(p_rotina ->> 'objetivo', ''),
      coalesce(p_rotina ->> 'orientacoes', ''), coalesce((p_rotina ->> 'publicado')::boolean, false))
    returning id into v_id;
  else
    update public.rotinas set nome = p_rotina ->> 'nome', tema_id = (p_rotina ->> 'tema_id')::uuid,
      nivel = p_rotina ->> 'nivel', local = p_rotina ->> 'local', descricao = coalesce(p_rotina ->> 'descricao', ''),
      tipo = v_tipo, objetivo = nullif(p_rotina ->> 'objetivo', ''), orientacoes = coalesce(p_rotina ->> 'orientacoes', ''),
      publicado = coalesce((p_rotina ->> 'publicado')::boolean, false)
    where id = v_id;
  end if;
  delete from public.rotina_treinos where rotina_id = v_id;
  if v_tipo = 'numerico' then
    insert into public.rotina_treinos (rotina_id, treino_id, ordem)
    select v_id, (d ->> 'treino_id')::uuid, (ordinality - 1)::integer
    from jsonb_array_elements(coalesce(p_dias, '[]'::jsonb)) with ordinality as e(d, ordinality);
  else
    insert into public.rotina_treinos (rotina_id, treino_id, dia_semana)
    select v_id, (d ->> 'treino_id')::uuid, (d ->> 'dia_semana')::integer
    from jsonb_array_elements(coalesce(p_dias, '[]'::jsonb)) as e(d);
  end if;
  return v_id;
end;
$$;

revoke all on function public.series_validas(jsonb) from public, anon;
grant execute on function public.series_validas(jsonb) to authenticated;
