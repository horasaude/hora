alter table public.pedidos add column codigo_acesso uuid not null default gen_random_uuid();
create unique index pedidos_codigo_acesso on public.pedidos (codigo_acesso);

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
  where p.codigo_acesso = p_codigo and p.status = 'aprovado';
$$;

revoke all on function public.acesso_do_link(uuid) from public, anon, authenticated;
grant execute on function public.acesso_do_link(uuid) to service_role;
