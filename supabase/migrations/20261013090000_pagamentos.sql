create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 3 and 120),
  email text not null check (char_length(email) between 3 and 254),
  cpf text not null check (cpf ~ '^\d{11}$'),
  whatsapp text not null check (whatsapp ~ '^\d{10,11}$'),
  plano text not null check (plano in ('pix', 'parcelado', 'recorrente')),
  valor_centavos integer not null check (valor_centavos > 0),
  parcelas integer not null default 1 check (parcelas between 1 and 12),
  oferta boolean not null default false,
  meses_acesso integer not null check (meses_acesso in (12, 13)),
  status text not null default 'criado'
    check (status in ('criado', 'pendente', 'aprovado', 'recusado', 'reembolsado', 'cancelado', 'chargeback')),
  status_detalhe text check (char_length(status_detalhe) <= 120),
  mp_pagamento_id text,
  mp_assinatura_id text unique,
  perfil_id uuid references public.perfis (id) on delete set null,
  codigo_indicacao text check (codigo_indicacao ~ '^[A-Z0-9]{4,16}$'),
  utms jsonb not null default '{}'::jsonb check (jsonb_typeof(utms) = 'object'),
  pix_copia_cola text,
  pix_expira_em timestamptz,
  lembrete_pix_em timestamptz,
  boas_vindas_em timestamptz,
  created_at timestamptz not null default now(),
  aprovado_em timestamptz,
  encerrado_em timestamptz,
  updated_at timestamptz not null default now()
);
create index pedidos_email on public.pedidos (lower(email));
create index pedidos_status on public.pedidos (status, created_at);

create table public.eventos_pagamento (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (char_length(tipo) <= 60),
  recurso_id text not null check (char_length(recurso_id) <= 80),
  status text not null default '' check (char_length(status) <= 60),
  pedido_id uuid references public.pedidos (id) on delete set null,
  dados jsonb not null default '{}'::jsonb,
  processado_em timestamptz,
  erro text check (char_length(erro) <= 500),
  created_at timestamptz not null default now(),
  unique (tipo, recurso_id, status)
);
create index eventos_pagamento_pedido on public.eventos_pagamento (pedido_id);

create table public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null unique references public.pedidos (id) on delete cascade,
  mp_assinatura_id text not null unique,
  status text not null default 'pendente'
    check (status in ('pendente', 'ativa', 'inadimplente', 'suspensa', 'cancelada', 'concluida')),
  proxima_cobranca timestamptz,
  parcelas_pagas integer not null default 0 check (parcelas_pagas between 0 and 12),
  ultima_cobranca_em timestamptz,
  inadimplente_desde timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger pedidos_updated_at before update on public.pedidos for each row execute function public.tocar_updated_at();
create trigger assinaturas_updated_at before update on public.assinaturas for each row execute function public.tocar_updated_at();

alter table public.pedidos enable row level security;
alter table public.eventos_pagamento enable row level security;
alter table public.assinaturas enable row level security;
revoke all on public.pedidos, public.eventos_pagamento, public.assinaturas from public, anon, authenticated;
grant select on public.pedidos, public.eventos_pagamento, public.assinaturas to authenticated;
grant all on public.pedidos, public.eventos_pagamento, public.assinaturas to service_role;
create policy "pedidos: admin lê" on public.pedidos for select to authenticated using (public.eh_admin());
create policy "eventos_pagamento: admin lê" on public.eventos_pagamento for select to authenticated using (public.eh_admin());
create policy "assinaturas: admin lê" on public.assinaturas for select to authenticated using (public.eh_admin());

alter table public.perfis add column acesso_suspenso_em timestamptz;

create or replace function public.tem_acesso_ativo()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfis
    where id = auth.uid()
      and acesso_inicio_em is not null
      and acesso_inicio_em <= now()
      and (acesso_fim_em is null or now() < acesso_fim_em)
      and acesso_suspenso_em is null
  );
$$;

create or replace function public.perfil_por_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from auth.users where lower(email) = lower(trim(p_email)) limit 1;
$$;

create or replace function public.situacao_pedido(p_pedido uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object('status', status, 'plano', plano, 'valor_centavos', valor_centavos)
  from public.pedidos where id = p_pedido;
$$;

create or replace function public.marcar_pedido(p_pedido uuid, p_status text, p_detalhe text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status not in ('pendente', 'recusado') then
    raise exception 'status inválido' using errcode = '22023';
  end if;
  update public.pedidos
  set status = p_status, status_detalhe = left(p_detalhe, 120)
  where id = p_pedido and status in ('criado', 'pendente', 'recusado');
  return found;
end;
$$;

create or replace function public.aprovar_pedido(p_pedido uuid, p_perfil uuid, p_aprovado_em timestamptz)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido public.pedidos;
  v_perfil public.perfis;
  v_inicio timestamptz;
  v_fim timestamptz;
begin
  select * into v_pedido from public.pedidos where id = p_pedido for update;
  if not found then
    raise exception 'pedido não encontrado' using errcode = 'P0002';
  end if;
  if v_pedido.status in ('aprovado', 'reembolsado', 'chargeback') or v_pedido.encerrado_em is not null then
    return false;
  end if;
  select * into v_perfil from public.perfis where id = p_perfil for update;
  if not found then
    raise exception 'pessoa não encontrada' using errcode = 'P0002';
  end if;
  if v_perfil.acesso_inicio_em is not null and v_perfil.acesso_inicio_em <= p_aprovado_em
    and (v_perfil.acesso_fim_em is null or v_perfil.acesso_fim_em > p_aprovado_em) then
    v_inicio := v_perfil.acesso_inicio_em;
  else
    v_inicio := p_aprovado_em;
  end if;
  v_fim := greatest(coalesce(v_perfil.acesso_fim_em, p_aprovado_em), p_aprovado_em + make_interval(months => v_pedido.meses_acesso));
  update public.perfis
  set acesso_inicio_em = v_inicio, acesso_fim_em = v_fim, acesso_suspenso_em = null,
      acesso_liberado_em = now(), acesso_liberado_por = null,
      nome = case when coalesce(nome, '') = '' then v_pedido.nome else nome end,
      cpf = case when cpf is null and not exists (select 1 from public.perfis o where o.cpf = v_pedido.cpf) then v_pedido.cpf else cpf end
  where id = p_perfil;
  insert into public.acessos_liberados (perfil_id, inicio, fim, liberado_por) values (p_perfil, v_inicio, v_fim, null);
  update public.pedidos set status = 'aprovado', status_detalhe = null, perfil_id = p_perfil, aprovado_em = p_aprovado_em where id = p_pedido;
  if v_pedido.codigo_indicacao is not null then
    perform public.registrar_indicacao(v_pedido.codigo_indicacao, v_pedido.nome, v_pedido.email, v_pedido.cpf, p_perfil);
  end if;
  return true;
end;
$$;

create or replace function public.encerrar_pedido(p_pedido uuid, p_status text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido public.pedidos;
begin
  if p_status not in ('reembolsado', 'cancelado', 'chargeback') then
    raise exception 'status inválido' using errcode = '22023';
  end if;
  select * into v_pedido from public.pedidos where id = p_pedido for update;
  if not found then
    raise exception 'pedido não encontrado' using errcode = 'P0002';
  end if;
  if v_pedido.status = p_status or v_pedido.status in ('reembolsado', 'chargeback') then
    return false;
  end if;
  update public.pedidos set status = p_status, encerrado_em = now() where id = p_pedido;
  update public.assinaturas set status = 'cancelada' where pedido_id = p_pedido and status <> 'concluida';
  if v_pedido.status = 'aprovado' and v_pedido.perfil_id is not null then
    update public.perfis set acesso_fim_em = now()
    where id = v_pedido.perfil_id and (acesso_fim_em is null or acesso_fim_em > now());
    update public.indicacoes set status = 'cancelada', motivo_cancelamento = 'compra desfeita'
    where lower(indicada_email) = lower(v_pedido.email) and status = 'aguardando';
  end if;
  return true;
end;
$$;

create or replace function public.registrar_assinatura(p_pedido uuid, p_mp_assinatura text, p_proxima timestamptz)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.assinaturas (pedido_id, mp_assinatura_id, proxima_cobranca)
  values (p_pedido, p_mp_assinatura, p_proxima)
  on conflict (pedido_id) do update set proxima_cobranca = coalesce(excluded.proxima_cobranca, assinaturas.proxima_cobranca);
$$;

create or replace function public.cobranca_assinatura(p_pedido uuid, p_aprovada boolean, p_quando timestamptz, p_proxima timestamptz)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pagas integer;
  v_perfil uuid;
begin
  select count(distinct recurso_id)::int into v_pagas from public.eventos_pagamento
  where pedido_id = p_pedido and tipo = 'subscription_authorized_payment' and status = 'approved';
  select perfil_id into v_perfil from public.pedidos where id = p_pedido;
  if p_aprovada then
    update public.assinaturas
    set parcelas_pagas = least(v_pagas, 12), inadimplente_desde = null,
        ultima_cobranca_em = greatest(coalesce(ultima_cobranca_em, p_quando), p_quando),
        proxima_cobranca = coalesce(p_proxima, proxima_cobranca),
        status = case when least(v_pagas, 12) >= 12 then 'concluida' when status = 'cancelada' then status else 'ativa' end
    where pedido_id = p_pedido;
    update public.perfis set acesso_suspenso_em = null where id = v_perfil;
  else
    update public.assinaturas
    set inadimplente_desde = coalesce(inadimplente_desde, p_quando),
        status = case when status in ('ativa', 'pendente') then 'inadimplente' else status end
    where pedido_id = p_pedido and status not in ('cancelada', 'concluida');
  end if;
  return (select jsonb_build_object('parcelas_pagas', parcelas_pagas, 'status', status) from public.assinaturas where pedido_id = p_pedido);
end;
$$;

create or replace function public.cancelar_assinatura(p_pedido uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido public.pedidos;
  v_assinatura public.assinaturas;
begin
  select * into v_pedido from public.pedidos where id = p_pedido;
  select * into v_assinatura from public.assinaturas where pedido_id = p_pedido for update;
  if not found or v_assinatura.status in ('cancelada', 'concluida') then
    return 'nada';
  end if;
  if v_pedido.status <> 'aprovado' then
    perform public.encerrar_pedido(p_pedido, 'cancelado');
    return 'cancelado';
  end if;
  if v_pedido.aprovado_em > now() - interval '7 days' then
    perform public.encerrar_pedido(p_pedido, 'cancelado');
    return 'arrependimento';
  end if;
  update public.assinaturas set status = 'cancelada' where pedido_id = p_pedido;
  update public.perfis
  set acesso_fim_em = least(acesso_fim_em, coalesce(v_assinatura.ultima_cobranca_em, v_pedido.aprovado_em) + interval '1 month')
  where id = v_pedido.perfil_id;
  return 'cancelada';
end;
$$;

create or replace function public.suspender_inadimplentes()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total integer;
begin
  with vencidas as (
    update public.assinaturas a set status = 'suspensa'
    where a.status = 'inadimplente' and a.inadimplente_desde <= now() - interval '7 days'
    returning a.pedido_id
  )
  update public.perfis p set acesso_suspenso_em = now()
  from vencidas v join public.pedidos pe on pe.id = v.pedido_id
  where p.id = pe.perfil_id and p.acesso_suspenso_em is null;
  get diagnostics v_total = row_count;
  return v_total;
end;
$$;

revoke all on function public.perfil_por_email(text), public.marcar_pedido(uuid, text, text),
  public.aprovar_pedido(uuid, uuid, timestamptz), public.encerrar_pedido(uuid, text),
  public.registrar_assinatura(uuid, text, timestamptz), public.cobranca_assinatura(uuid, boolean, timestamptz, timestamptz),
  public.cancelar_assinatura(uuid), public.suspender_inadimplentes() from public, anon, authenticated;
grant execute on function public.perfil_por_email(text), public.marcar_pedido(uuid, text, text),
  public.aprovar_pedido(uuid, uuid, timestamptz), public.encerrar_pedido(uuid, text),
  public.registrar_assinatura(uuid, text, timestamptz), public.cobranca_assinatura(uuid, boolean, timestamptz, timestamptz),
  public.cancelar_assinatura(uuid), public.suspender_inadimplentes() to service_role;
revoke all on function public.situacao_pedido(uuid) from public;
grant execute on function public.situacao_pedido(uuid) to anon, authenticated, service_role;

do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron;
    perform cron.schedule('suspender-inadimplentes', '20 * * * *', 'select public.suspender_inadimplentes()');
  end if;
end;
$$;

do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron')
    and exists (select 1 from pg_available_extensions where name = 'pg_net') then
    create extension if not exists pg_net;
    perform cron.schedule(
      'lembretes-pagamento',
      '*/5 * * * *',
      $cron$
        select net.http_post(
          url := 'https://zijtjwhvnhfarmfscmnr.supabase.co/functions/v1/lembretes-pagamento',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-cron-segredo', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_segredo')
          ),
          body := '{}'::jsonb
        )
      $cron$
    );
  end if;
end;
$$;
