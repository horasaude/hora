create table public.loja_parceiros (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(btrim(nome)) between 1 and 80),
  logo_path text check (char_length(logo_path) <= 200),
  descricao text not null default '' check (char_length(descricao) <= 300),
  cupom text check (char_length(cupom) between 1 and 40),
  whatsapp text check (whatsapp ~ '^[0-9]{10,13}$'),
  site_url text check (site_url ~ '^https://' and char_length(site_url) <= 500),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.loja_parceiros (nome, descricao) values ('Active Life', 'Suplementos e alimentação saudável');

create table public.loja_produtos (
  id uuid primary key default gen_random_uuid(),
  parceiro_id uuid not null references public.loja_parceiros (id) on delete restrict,
  nome text not null check (char_length(btrim(nome)) between 1 and 120),
  descricao text not null default '' check (char_length(descricao) <= 2000),
  categoria text not null check (categoria in ('suplementos', 'alimentacao', 'acessorios', 'outros')),
  foto_path text check (char_length(foto_path) <= 200),
  preco_centavos integer not null check (preco_centavos between 1 and 100000000),
  preco_final_centavos integer not null check (preco_final_centavos >= 1),
  cupom text check (char_length(cupom) between 1 and 40),
  link_url text not null check (link_url ~ '^https://' and char_length(link_url) <= 1000),
  destaque boolean not null default false,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (preco_final_centavos <= preco_centavos)
);
create index loja_produtos_parceiro_idx on public.loja_produtos (parceiro_id);

create table public.loja_cliques (
  id bigint generated always as identity primary key,
  produto_id uuid not null references public.loja_produtos (id) on delete cascade,
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index loja_cliques_produto_idx on public.loja_cliques (produto_id, created_at desc);
create index loja_cliques_data_idx on public.loja_cliques (created_at desc);

alter table public.loja_parceiros enable row level security;
alter table public.loja_produtos enable row level security;
alter table public.loja_cliques enable row level security;

revoke all on public.loja_parceiros, public.loja_produtos, public.loja_cliques from anon, authenticated;
grant select, insert, update on public.loja_parceiros, public.loja_produtos to authenticated;
grant delete on public.loja_produtos to authenticated;
grant select on public.loja_cliques to authenticated;

create policy "loja parceiros: admin gerencia" on public.loja_parceiros
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "loja parceiros: aluna vê ativos" on public.loja_parceiros
  for select to authenticated using (ativo and public.tem_acesso_ativo());
create policy "loja produtos: admin gerencia" on public.loja_produtos
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "loja produtos: aluna vê publicados de parceiro ativo" on public.loja_produtos
  for select to authenticated using (
    publicado and public.tem_acesso_ativo()
    and exists (select 1 from public.loja_parceiros p where p.id = parceiro_id and p.ativo)
  );
create policy "loja cliques: admin lê" on public.loja_cliques
  for select to authenticated using (public.eh_admin());

create or replace function public.registrar_clique_loja(p_produto uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.tem_acesso_ativo() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.loja_produtos pr join public.loja_parceiros pa on pa.id = pr.parceiro_id
    where pr.id = p_produto and pr.publicado and pa.ativo
  ) then
    raise exception 'produto não encontrado' using errcode = '22023';
  end if;
  if exists (
    select 1 from public.loja_cliques
    where produto_id = p_produto and perfil_id = auth.uid() and created_at > now() - interval '1 minute'
  ) then
    return;
  end if;
  insert into public.loja_cliques (produto_id, perfil_id) values (p_produto, auth.uid());
end;
$$;

create or replace function public.painel_loja()
returns table (publicados integer, parceiros_ativos integer, cliques_mes integer, mais_clicado text, mais_clicado_cliques integer)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_inicio timestamptz := date_trunc('month', now() at time zone 'America/Sao_Paulo') at time zone 'America/Sao_Paulo';
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  return query
  select
    (select count(*)::integer from public.loja_produtos where publicado),
    (select count(*)::integer from public.loja_parceiros where ativo),
    (select count(*)::integer from public.loja_cliques where created_at >= v_inicio),
    m.nome, coalesce(m.total, 0)::integer
  from (select 1) um
  left join lateral (
    select pr.nome, count(*) as total
    from public.loja_cliques c join public.loja_produtos pr on pr.id = c.produto_id
    where c.created_at >= v_inicio
    group by pr.id, pr.nome
    order by count(*) desc, pr.nome
    limit 1
  ) m on true;
end;
$$;

create or replace function public.cliques_por_semana(p_produto uuid, p_semanas integer default 8)
returns table (semana date, cliques integer)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_atual date := date_trunc('week', now() at time zone 'America/Sao_Paulo')::date;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  return query
  select s.semana::date, count(c.id)::integer
  from generate_series(v_atual - (least(greatest(p_semanas, 1), 26) - 1) * 7, v_atual, interval '7 days') as s(semana)
  left join public.loja_cliques c
    on c.produto_id = p_produto
    and date_trunc('week', c.created_at at time zone 'America/Sao_Paulo')::date = s.semana::date
  group by s.semana
  order by s.semana;
end;
$$;

revoke all on function public.registrar_clique_loja(uuid), public.painel_loja(), public.cliques_por_semana(uuid, integer) from public, anon;
grant execute on function public.registrar_clique_loja(uuid), public.painel_loja(), public.cliques_por_semana(uuid, integer) to authenticated;

insert into storage.buckets (id, name, public) values ('loja', 'loja', false) on conflict (id) do nothing;

create policy "loja fotos: admin gerencia" on storage.objects
  for all to authenticated
  using (bucket_id = 'loja' and public.eh_admin())
  with check (bucket_id = 'loja' and public.eh_admin());
create policy "loja fotos: aluna vê as da vitrine" on storage.objects
  for select to authenticated using (
    bucket_id = 'loja' and public.tem_acesso_ativo() and (
      exists (select 1 from public.loja_produtos pr join public.loja_parceiros pa on pa.id = pr.parceiro_id
        where pr.foto_path = name and pr.publicado and pa.ativo)
      or exists (select 1 from public.loja_parceiros pa where pa.logo_path = name and pa.ativo)
    )
  );
