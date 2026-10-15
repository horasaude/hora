alter table public.configuracoes
  add column agua_meta_ml integer not null default 2000 check (agua_meta_ml between 500 and 6000);

create table public.agua_registros (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  dia date not null default public.hoje_brasilia(),
  ml integer not null check (ml between 50 and 2000),
  created_at timestamptz not null default now()
);
create index agua_registros_perfil_dia on public.agua_registros (perfil_id, dia);

alter table public.agua_registros enable row level security;
revoke all on public.agua_registros from anon, authenticated;
grant select on public.agua_registros to authenticated;
create policy "agua_registros: dona e admin leem" on public.agua_registros
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());

create or replace function public.registrar_agua(p_ml integer)
returns table (total integer, meta integer, pontos integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total integer;
  v_meta integer;
  v_check uuid;
  v_lanc uuid;
  v_pontos integer := 0;
begin
  if not public.tem_acesso_ativo() then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  if p_ml is null or p_ml = 0 or abs(p_ml) > 2000 then
    raise exception 'quantidade inválida' using errcode = '22023';
  end if;
  if p_ml > 0 then
    insert into public.agua_registros (perfil_id, ml) values (auth.uid(), p_ml);
  else
    delete from public.agua_registros where id = (
      select a.id from public.agua_registros a
      where a.perfil_id = auth.uid() and a.dia = public.hoje_brasilia()
      order by a.created_at desc limit 1
    );
  end if;
  select coalesce(sum(a.ml), 0)::integer into v_total from public.agua_registros a
  where a.perfil_id = auth.uid() and a.dia = public.hoje_brasilia();
  select c.agua_meta_ml into v_meta from public.configuracoes c limit 1;
  v_meta := coalesce(v_meta, 2000);
  if v_total >= v_meta then
    insert into public.checkins (perfil_id, tipo) values (auth.uid(), 'agua')
    on conflict (perfil_id, tipo, dia) do nothing
    returning id into v_check;
    if v_check is not null then
      v_lanc := public.conceder_pontos(auth.uid(), 'agua', 'checkin', v_check::text);
      select coalesce(l.pontos, 0) into v_pontos from public.lancamentos_pontos l where l.id = v_lanc;
    end if;
  end if;
  return query select v_total, v_meta, coalesce(v_pontos, 0);
end;
$$;

revoke all on function public.registrar_agua(integer) from public, anon;
grant execute on function public.registrar_agua(integer) to authenticated;

create or replace function public.fazer_checkin(
  p_tipo text, p_foto_path text default null, p_tipo_treino text default null, p_duracao integer default null
)
returns table (id uuid, pontos integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_acao text;
  v_lanc uuid;
begin
  if not public.tem_acesso_ativo() then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  if p_tipo = 'agua' then
    raise exception 'água é pela meta em ml (registrar_agua)' using errcode = '22023';
  end if;
  if p_tipo in ('treino', 'refeicao') and p_foto_path is null then
    raise exception 'foto obrigatória' using errcode = '22023';
  end if;
  if p_tipo = 'treino' and coalesce(p_tipo_treino, '') not in ('musculacao', 'caminhada', 'corrida', 'funcional', 'outro') then
    raise exception 'tipo de treino inválido' using errcode = '22023';
  end if;
  if p_foto_path is not null and split_part(p_foto_path, '/', 1) <> auth.uid()::text then
    raise exception 'foto de outra pessoa' using errcode = '42501';
  end if;
  insert into public.checkins (perfil_id, tipo, foto_path, tipo_treino, duracao_minutos)
  values (auth.uid(), p_tipo, p_foto_path, left(p_tipo_treino, 60), case when p_tipo = 'treino' then p_duracao end)
  on conflict (perfil_id, tipo, dia) do nothing
  returning checkins.id into v_id;
  if v_id is null then
    select c.id into v_id from public.checkins c
    where c.perfil_id = auth.uid() and c.tipo = p_tipo and c.dia = public.hoje_brasilia();
    return query select v_id, 0;
    return;
  end if;
  v_acao := case p_tipo when 'treino' then 'treino_foto' when 'refeicao' then 'foto_refeicao' else p_tipo end;
  v_lanc := public.conceder_pontos(auth.uid(), v_acao, 'checkin', v_id::text);
  return query select v_id, coalesce((select l.pontos from public.lancamentos_pontos l where l.id = v_lanc), 0);
end;
$$;
