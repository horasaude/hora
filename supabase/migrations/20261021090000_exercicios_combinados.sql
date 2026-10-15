alter table public.treino_exercicios
  add column combinado smallint check (combinado between 1 and 30);

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
    insert into public.treinos (nome, tema_id, nivel, local, duracao_minutos, descricao, aquecimento, alongamento, orientacoes, categoria, publicado)
    values (p_treino ->> 'nome', (p_treino ->> 'tema_id')::uuid, p_treino ->> 'nivel', p_treino ->> 'local',
      nullif(p_treino ->> 'duracao_minutos', '')::integer, coalesce(p_treino ->> 'descricao', ''),
      coalesce(p_treino ->> 'aquecimento', ''), coalesce(p_treino ->> 'alongamento', ''),
      coalesce(p_treino ->> 'orientacoes', ''), coalesce(nullif(p_treino ->> 'categoria', ''), 'musculacao'),
      coalesce((p_treino ->> 'publicado')::boolean, false))
    returning id into v_id;
  else
    update public.treinos set
      nome = p_treino ->> 'nome', tema_id = (p_treino ->> 'tema_id')::uuid, nivel = p_treino ->> 'nivel',
      local = p_treino ->> 'local', duracao_minutos = nullif(p_treino ->> 'duracao_minutos', '')::integer,
      descricao = coalesce(p_treino ->> 'descricao', ''), aquecimento = coalesce(p_treino ->> 'aquecimento', ''),
      alongamento = coalesce(p_treino ->> 'alongamento', ''), orientacoes = coalesce(p_treino ->> 'orientacoes', ''),
      categoria = coalesce(nullif(p_treino ->> 'categoria', ''), 'musculacao'),
      publicado = coalesce((p_treino ->> 'publicado')::boolean, false)
    where id = v_id;
  end if;
  delete from public.treino_exercicios where treino_id = v_id;
  insert into public.treino_exercicios (treino_id, exercicio_id, ordem, series, repeticoes, carga, descanso_segundos,
    observacao, series_detalhe, alternativo_id, combinado)
  select v_id, (i ->> 'exercicio_id')::uuid, (ordinality - 1)::integer,
    case when jsonb_array_length(coalesce(i -> 'series_detalhe', '[]'::jsonb)) > 0
      then jsonb_array_length(i -> 'series_detalhe') else coalesce((i ->> 'series')::integer, 3) end,
    coalesce(nullif(i ->> 'repeticoes', ''), '12'), coalesce(i ->> 'carga', ''),
    coalesce((i ->> 'descanso_segundos')::integer, 60), coalesce(i ->> 'observacao', ''),
    coalesce(i -> 'series_detalhe', '[]'::jsonb), nullif(i ->> 'alternativo_id', '')::uuid,
    nullif(i ->> 'combinado', '')::smallint
  from jsonb_array_elements(coalesce(p_itens, '[]'::jsonb)) with ordinality as e(i, ordinality);
  return v_id;
end;
$$;

