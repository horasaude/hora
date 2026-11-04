create table public.parceiras (
  perfil_id uuid primary key references public.perfis (id) on delete cascade,
  meses integer not null check (meses in (1, 3, 6, 12)),
  codigo_acesso uuid not null unique default gen_random_uuid(),
  criada_por uuid references public.perfis (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.parceiras enable row level security;
revoke all on public.parceiras from anon, authenticated;
grant select on public.parceiras to authenticated;
create policy "parceiras: admin lê" on public.parceiras
  for select to authenticated using (public.eh_admin());

create or replace function public.registrar_parceira(p_perfil uuid, p_meses integer, p_por uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_perfil public.perfis;
  v_inicio timestamptz := now();
  v_fim timestamptz;
  v_codigo uuid;
begin
  if p_meses is null or p_meses not in (1, 3, 6, 12) then
    raise exception 'prazo inválido' using errcode = '22023';
  end if;
  select * into v_perfil from public.perfis where id = p_perfil for update;
  if not found then
    raise exception 'pessoa não encontrada' using errcode = 'P0002';
  end if;
  if v_perfil.papel <> 'aluna' then
    raise exception 'equipe' using errcode = 'P0001';
  end if;
  if v_perfil.acesso_fim_em > now() and v_perfil.acesso_inicio_em <= now()
    and not exists (select 1 from public.parceiras where perfil_id = p_perfil) then
    raise exception 'ja_tem_acesso' using errcode = 'P0001';
  end if;
  v_fim := v_inicio + make_interval(months => p_meses);
  update public.perfis
  set acesso_inicio_em = v_inicio, acesso_fim_em = v_fim, acesso_suspenso_em = null,
      acesso_liberado_por = p_por, acesso_liberado_em = now()
  where id = p_perfil;
  insert into public.acessos_liberados (perfil_id, inicio, fim, liberado_por) values (p_perfil, v_inicio, v_fim, p_por);
  insert into public.parceiras (perfil_id, meses, criada_por) values (p_perfil, p_meses, p_por)
  on conflict (perfil_id) do update set meses = excluded.meses, criada_por = excluded.criada_por
  returning codigo_acesso into v_codigo;
  return v_codigo;
end;
$$;

revoke all on function public.registrar_parceira(uuid, integer, uuid) from public, anon, authenticated;
grant execute on function public.registrar_parceira(uuid, integer, uuid) to service_role;

create or replace function public.acesso_do_link(p_codigo uuid)
returns table (email text, tem_senha boolean)
language sql
stable
security definer
set search_path = public
as $$
  select u.email, coalesce(u.encrypted_password, '') <> ''
  from public.pedidos p
  join auth.users u on u.id = p.perfil_id
  where p.codigo_acesso = p_codigo and p.status = 'aprovado'
  union all
  select u.email, coalesce(u.encrypted_password, '') <> ''
  from public.parceiras pa
  join public.perfis pe on pe.id = pa.perfil_id
  join auth.users u on u.id = pa.perfil_id
  where pa.codigo_acesso = p_codigo and pe.acesso_fim_em > now();
$$;

revoke all on function public.acesso_do_link(uuid) from public, anon, authenticated;
grant execute on function public.acesso_do_link(uuid) to service_role;

drop function public.painel_alunas();

create function public.painel_alunas()
returns table (
  id uuid,
  nome text,
  apelido text,
  acesso_inicio_em timestamptz,
  acesso_fim_em timestamptz,
  ultimo_acesso_em timestamptz,
  dia integer,
  aulas_liberadas integer,
  aulas_concluidas integer,
  cobranca text,
  parceira boolean
)
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  return query
  with base as (
    select p.*,
      case when p.acesso_inicio_em <= now()
        then floor(extract(epoch from (now() - p.acesso_inicio_em)) / 86400)::integer + 1 end as dia_atual
    from public.perfis p
    where p.papel = 'aluna'
  )
  select b.id, b.nome, b.apelido, b.acesso_inicio_em, b.acesso_fim_em, b.ultimo_acesso_em, b.dia_atual,
    (select count(*)::integer from public.aulas a
       join public.etapas e on e.id = a.etapa_id join public.temas t on t.id = e.tema_id
       where a.publicado and e.publicado and t.publicado and a.dia_liberacao <= coalesce(b.dia_atual, 0)),
    (select count(*)::integer from public.aulas_concluidas c where c.perfil_id = b.id),
    (select a.status from public.assinaturas a join public.pedidos pe on pe.id = a.pedido_id
       where pe.perfil_id = b.id and a.status in ('inadimplente', 'suspensa')
       order by a.inadimplente_desde desc nulls last limit 1),
    exists (select 1 from public.parceiras pa where pa.perfil_id = b.id)
  from base b
  order by b.acesso_inicio_em desc nulls last, b.nome;
end;
$$;

revoke all on function public.painel_alunas() from public, anon;
grant execute on function public.painel_alunas() to authenticated;
