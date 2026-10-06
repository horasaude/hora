alter table public.etapas
  drop constraint etapas_tema_id_ordem_key,
  add constraint etapas_tema_id_ordem_key unique (tema_id, ordem) deferrable initially deferred;

create or replace function public.mover_tema(p_id uuid, p_direcao integer)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_pos integer;
  v_vizinho uuid;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  update public.temas t set ordem = l.pos
  from (select id, row_number() over (order by ordem, created_at, id) as pos from public.temas) l
  where l.id = t.id and t.ordem <> l.pos;
  select ordem into v_pos from public.temas where id = p_id;
  select id into v_vizinho from public.temas where ordem = v_pos + sign(p_direcao);
  if v_vizinho is null then
    return;
  end if;
  update public.temas set ordem = v_pos + sign(p_direcao) where id = p_id;
  update public.temas set ordem = v_pos where id = v_vizinho;
end;
$$;

create or replace function public.mover_etapa(p_id uuid, p_direcao integer)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_tema uuid;
  v_pos integer;
  v_vizinho uuid;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  select tema_id into v_tema from public.etapas where id = p_id;
  update public.etapas e set ordem = l.pos
  from (
    select id, row_number() over (order by ordem, created_at, id) as pos
    from public.etapas where tema_id = v_tema
  ) l
  where l.id = e.id and e.ordem <> l.pos;
  select ordem into v_pos from public.etapas where id = p_id;
  select id into v_vizinho from public.etapas where tema_id = v_tema and ordem = v_pos + sign(p_direcao);
  if v_vizinho is null then
    return;
  end if;
  update public.etapas set ordem = v_pos + sign(p_direcao) where id = p_id;
  update public.etapas set ordem = v_pos where id = v_vizinho;
end;
$$;

create or replace function public.mover_aula(p_id uuid, p_direcao integer)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_etapa uuid;
  v_pos integer;
  v_vizinho uuid;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  select etapa_id into v_etapa from public.aulas where id = p_id;
  update public.aulas a set ordem = l.pos
  from (
    select id, row_number() over (order by ordem, created_at, id) as pos
    from public.aulas where etapa_id = v_etapa
  ) l
  where l.id = a.id and a.ordem <> l.pos;
  select ordem into v_pos from public.aulas where id = p_id;
  select id into v_vizinho from public.aulas where etapa_id = v_etapa and ordem = v_pos + sign(p_direcao);
  if v_vizinho is null then
    return;
  end if;
  update public.aulas set ordem = v_pos + sign(p_direcao) where id = p_id;
  update public.aulas set ordem = v_pos where id = v_vizinho;
end;
$$;

revoke all on function public.mover_tema(uuid, integer), public.mover_etapa(uuid, integer), public.mover_aula(uuid, integer) from public, anon;
grant execute on function public.mover_tema(uuid, integer), public.mover_etapa(uuid, integer), public.mover_aula(uuid, integer) to authenticated;
