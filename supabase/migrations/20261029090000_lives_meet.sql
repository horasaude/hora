alter table public.lives add column google_evento_id text;

create table public.conexao_google (
  id smallint primary key default 1 check (id = 1),
  conta text not null,
  refresh_token text not null,
  conectado_em timestamptz not null default now()
);

alter table public.conexao_google enable row level security;
revoke all on table public.conexao_google from public, anon, authenticated;
grant all on table public.conexao_google to service_role;

create or replace function public.google_conectado()
returns table (conta text, conectado_em timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select c.conta, c.conectado_em from public.conexao_google c where public.eh_admin();
$$;

revoke all on function public.google_conectado() from public, anon;
grant execute on function public.google_conectado() to authenticated;
