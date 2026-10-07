alter table public.checkins
  add column duracao_minutos integer check (duracao_minutos between 1 and 600);

alter table public.perfis
  add column avatar_path text check (
    avatar_path is null or (char_length(avatar_path) <= 200 and split_part(avatar_path, '/', 1) = id::text)
  );
grant update (avatar_path) on public.perfis to authenticated;

drop function public.fazer_checkin(text, text, text);

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

create or replace function public.ranking_pontos(p_periodo text)
returns table (posicao integer, apelido text, pontos integer, eu boolean)
language sql
stable
security definer
set search_path = public
as $$
  with inicio as (
    select case when p_periodo = 'ano' then date_trunc('year', public.hoje_brasilia())::date
      else date_trunc('month', public.hoje_brasilia())::date end as dia
  ),
  somas as (
    select l.perfil_id, sum(l.pontos)::integer as total
    from public.lancamentos_pontos l, inicio i
    where l.dia >= i.dia
    group by l.perfil_id
  ),
  gente as (
    select p.id, coalesce(nullif(p.apelido, ''), 'aluna') as nome, coalesce(s.total, 0) as total
    from public.perfis p left join somas s on s.perfil_id = p.id
    where p.papel = 'aluna'
      and (p.id = auth.uid() or (not p.ocultar_ranking and coalesce(s.total, 0) > 0))
  )
  select (row_number() over (order by g.total desc, g.nome))::integer, g.nome, g.total, g.id = auth.uid()
  from gente g
  where public.eh_admin() or public.tem_acesso_ativo()
  order by 1;
$$;

create or replace function public.meus_desafios()
returns table (
  id uuid, nome text, descricao text, inicio date, fim date, tipo_checkin text, unidade text,
  meta_diaria integer, meta_dias integer, pontos_por_dia integer, bonus_conclusao integer,
  premio text, premio_surpresa boolean, encerrado boolean, participando boolean,
  participantes integer, dias_feitos integer, feito_hoje boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select d.id, d.nome, d.descricao, d.inicio, d.fim, d.tipo_checkin::text, d.unidade,
    d.meta_diaria, d.meta_dias, d.pontos_por_dia, d.bonus_conclusao, d.premio, d.premio_surpresa,
    (d.encerrado_em is not null or d.fim < public.hoje_brasilia()),
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
  from public.desafios d
  where d.publicado and auth.uid() is not null and (public.eh_admin() or public.tem_acesso_ativo())
  order by d.inicio desc, d.nome;
$$;

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
    select 1 from public.desafios d
    where d.id = p_desafio and d.publicado and d.encerrado_em is null and public.hoje_brasilia() <= d.fim
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
begin
  if not public.tem_acesso_ativo() then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  select * into v_d from public.desafios where id = p_desafio and publicado;
  if not found or v_d.encerrado_em is not null or public.hoje_brasilia() not between v_d.inicio and v_d.fim then
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

create or replace function public.ranking_desafio(p_desafio uuid)
returns table (posicao integer, apelido text, dias integer, eu boolean)
language sql
stable
security definer
set search_path = public
as $$
  with gente as (
    select p.perfil_id from public.desafio_participantes p where p.desafio_id = p_desafio
    union
    select c.perfil_id from public.desafio_checkins c where c.desafio_id = p_desafio
  ),
  linhas as (
    select pf.id, coalesce(nullif(pf.apelido, ''), 'aluna') as nome, public.dias_cumpridos(p_desafio, pf.id) as feitos
    from gente g join public.perfis pf on pf.id = g.perfil_id
    where pf.id = auth.uid() or not pf.ocultar_ranking
  )
  select (row_number() over (order by l.feitos desc, l.nome))::integer, l.nome, l.feitos, l.id = auth.uid()
  from linhas l
  where exists (select 1 from public.desafios d where d.id = p_desafio and d.publicado)
    and (public.eh_admin() or public.tem_acesso_ativo())
  order by 1;
$$;

create table public.medidas (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  dia date not null default public.hoje_brasilia(),
  peso numeric(5, 1) check (peso between 20 and 400),
  cintura numeric(5, 1) check (cintura between 20 and 300),
  quadril numeric(5, 1) check (quadril between 20 and 300),
  braco numeric(5, 1) check (braco between 5 and 150),
  coxa numeric(5, 1) check (coxa between 10 and 200),
  foto_path text check (foto_path is null or (char_length(foto_path) <= 200 and split_part(foto_path, '/', 1) = perfil_id::text)),
  created_at timestamptz not null default now(),
  check (dia <= public.hoje_brasilia() and dia >= date '2026-01-01'),
  check (coalesce(peso, cintura, quadril, braco, coxa) is not null)
);
create index medidas_perfil_idx on public.medidas (perfil_id, dia desc);

alter table public.medidas enable row level security;
revoke all on public.medidas from anon, authenticated;
grant select, insert, delete on public.medidas to authenticated;

create policy "medidas: dona e admin leem" on public.medidas
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "medidas: dona registra" on public.medidas
  for insert to authenticated with check (perfil_id = auth.uid() and public.tem_acesso_ativo());
create policy "medidas: dona apaga" on public.medidas
  for delete to authenticated using (perfil_id = auth.uid());

insert into storage.buckets (id, name, public) values ('evolucao', 'evolucao', false) on conflict (id) do nothing;

create policy "evolucao: aluna envia na pasta dela" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'evolucao' and split_part(name, '/', 1) = auth.uid()::text);
create policy "evolucao: dona e admin veem" on storage.objects
  for select to authenticated
  using (bucket_id = 'evolucao' and (split_part(name, '/', 1) = auth.uid()::text or public.eh_admin()));
create policy "evolucao: dona apaga" on storage.objects
  for delete to authenticated
  using (bucket_id = 'evolucao' and split_part(name, '/', 1) = auth.uid()::text);

revoke all on function public.fazer_checkin(text, text, text, integer), public.ranking_pontos(text), public.meus_desafios(),
  public.entrar_desafio(uuid), public.checkin_desafio(uuid, integer, text), public.ranking_desafio(uuid) from public, anon;
grant execute on function public.fazer_checkin(text, text, text, integer), public.ranking_pontos(text), public.meus_desafios(),
  public.entrar_desafio(uuid), public.checkin_desafio(uuid, integer, text), public.ranking_desafio(uuid) to authenticated;
