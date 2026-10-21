alter table public.rotina_treinos
  drop constraint rotina_treinos_rotina_id_dia_semana_key,
  drop constraint rotina_treinos_dia_ou_ordem,
  add constraint rotina_treinos_dia_ou_ordem check (dia_semana is not null or ordem is not null),
  add constraint rotina_treinos_dia_treino_key unique (rotina_id, dia_semana, treino_id);

create index if not exists rotina_treinos_rotina on public.rotina_treinos (rotina_id, ordem);

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
  insert into public.rotina_treinos (rotina_id, treino_id, dia_semana, ordem)
  select v_id, (d ->> 'treino_id')::uuid, nullif(d ->> 'dia_semana', '')::integer, (ordinality - 1)::integer
  from jsonb_array_elements(coalesce(p_dias, '[]'::jsonb)) with ordinality as e(d, ordinality)
  where v_tipo = 'numerico' or nullif(d ->> 'dia_semana', '') is not null;
  return v_id;
end;
$$;

revoke all on function public.salvar_rotina(jsonb, jsonb) from public, anon;
grant execute on function public.salvar_rotina(jsonb, jsonb) to authenticated;
