create table public.cupons (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique check (codigo ~ '^[A-Z0-9]{3,20}$'),
  tipo text not null check (tipo in ('porcentagem', 'valor')),
  valor integer not null check (
    (tipo = 'porcentagem' and valor between 1 and 90) or (tipo = 'valor' and valor between 1 and 10000000)
  ),
  planos text[] not null default array['pix', 'parcelado', 'recorrente']
    check (cardinality(planos) > 0 and planos <@ array['pix', 'parcelado', 'recorrente']),
  limite_usos integer check (limite_usos > 0),
  valido_ate timestamptz,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger cupons_updated_at before update on public.cupons for each row execute function public.tocar_updated_at();

alter table public.cupons enable row level security;
revoke all on public.cupons from public, anon, authenticated;
grant select, insert, update, delete on public.cupons to authenticated;
grant all on public.cupons to service_role;
create policy "cupons: admin gerencia" on public.cupons
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());

alter table public.pedidos
  add column cupom_id uuid references public.cupons (id) on delete set null,
  add column desconto_centavos integer not null default 0 check (desconto_centavos >= 0);
create index pedidos_cupom_idx on public.pedidos (cupom_id) where cupom_id is not null;

create or replace function public.usos(c public.cupons)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer from public.pedidos p where p.cupom_id = c.id and p.status = 'aprovado';
$$;
revoke all on function public.usos(public.cupons) from public, anon;
grant execute on function public.usos(public.cupons) to authenticated, service_role;

create or replace function public.consultar_cupom(p_codigo text)
returns table (id uuid, codigo text, tipo text, valor integer, planos text[])
language sql
stable
security definer
set search_path = public
as $$
  select c.id, c.codigo, c.tipo, c.valor, c.planos
  from public.cupons c
  where c.codigo = upper(trim(p_codigo))
    and c.ativo
    and (c.valido_ate is null or now() <= c.valido_ate)
    and (
      c.limite_usos is null or c.limite_usos > (
        select count(*) from public.pedidos p
        where p.cupom_id = c.id
          and (p.status = 'aprovado'
            or (p.status in ('criado', 'pendente') and p.created_at > now() - interval '40 minutes'))
      )
    );
$$;
revoke all on function public.consultar_cupom(text) from public;
grant execute on function public.consultar_cupom(text) to anon, authenticated, service_role;
