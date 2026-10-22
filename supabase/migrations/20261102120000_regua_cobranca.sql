alter table public.assinaturas add column fatura_url text check (fatura_url ~ '^https://');

create table public.avisos_cobranca (
  pedido_id uuid not null references public.pedidos (id) on delete cascade,
  etapa text not null check (etapa in ('lembrete', 'vespera', 'pausado')),
  desde timestamptz not null,
  enviado_em timestamptz not null default now(),
  primary key (pedido_id, etapa, desde)
);

alter table public.avisos_cobranca enable row level security;
revoke all on table public.avisos_cobranca from public, anon, authenticated;
grant all on table public.avisos_cobranca to service_role;

create or replace function public.cobrancas_pendentes()
returns table (pedido uuid, email text, nome text, etapa text, desde timestamptz, fatura_url text)
language sql
stable
security definer
set search_path = public
as $$
  select x.pedido, x.email, x.nome, x.etapa, x.desde, x.fatura_url
  from (
    select pe.id as pedido, pe.email, pe.nome, a.inadimplente_desde as desde, a.fatura_url,
      case
        when a.status = 'suspensa' then 'pausado'
        when now() >= a.inadimplente_desde + interval '6 days' then 'vespera'
        when now() >= a.inadimplente_desde + interval '3 days' then 'lembrete'
      end as etapa
    from public.assinaturas a
    join public.pedidos pe on pe.id = a.pedido_id
    where a.status in ('inadimplente', 'suspensa') and a.inadimplente_desde is not null
  ) x
  where x.etapa is not null
    and not exists (
      select 1 from public.avisos_cobranca v
      where v.pedido_id = x.pedido and v.etapa = x.etapa and v.desde = x.desde
    );
$$;

create or replace function public.assinaturas_para_conferir()
returns table (pedido uuid, assinatura text)
language sql
stable
security definer
set search_path = public
as $$
  select a.pedido_id, a.mp_assinatura_id
  from public.assinaturas a
  where a.status in ('pendente', 'ativa', 'inadimplente', 'suspensa');
$$;

create or replace function public.minha_pendencia()
returns table (pausado boolean, fatura_url text)
language sql
stable
security definer
set search_path = public
as $$
  select a.status = 'suspensa', a.fatura_url
  from public.assinaturas a
  join public.pedidos pe on pe.id = a.pedido_id
  where pe.perfil_id = auth.uid() and a.status in ('inadimplente', 'suspensa')
  order by a.inadimplente_desde desc nulls last
  limit 1;
$$;

revoke all on function public.cobrancas_pendentes(), public.assinaturas_para_conferir() from public, anon, authenticated;
grant execute on function public.cobrancas_pendentes(), public.assinaturas_para_conferir() to service_role;
revoke all on function public.minha_pendencia() from public, anon;
grant execute on function public.minha_pendencia() to authenticated;

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
  cobranca text
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
       order by a.inadimplente_desde desc nulls last limit 1)
  from base b
  order by b.acesso_inicio_em desc nulls last, b.nome;
end;
$$;

revoke all on function public.painel_alunas() from public, anon;
grant execute on function public.painel_alunas() to authenticated;

do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron')
    and exists (select 1 from pg_available_extensions where name = 'pg_net') then
    perform cron.schedule(
      'cobranca-diaria',
      '5 * * * *',
      $cron$
        select net.http_post(
          url := 'https://zijtjwhvnhfarmfscmnr.supabase.co/functions/v1/cobranca-diaria',
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
