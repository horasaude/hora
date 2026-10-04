-- Perfis das usuárias, papel e função de permissão de admin.

create type public.papel as enum ('aluna', 'admin');

create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '',
  apelido text,
  papel public.papel not null default 'aluna',
  ocultar_ranking boolean not null default false,
  consentimento_saude_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.perfis enable row level security;

create or replace function public.eh_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfis where id = auth.uid() and papel = 'admin'
  );
$$;

create policy "perfil: dona lê o seu" on public.perfis
  for select using (id = auth.uid() or public.eh_admin());

-- A aluna edita só os próprios dados básicos. O papel (aluna/admin) não pode ser alterado pelo app:
-- mudança de papel será feita por função própria, com registro em log.
revoke update on public.perfis from authenticated;
grant update (nome, apelido, ocultar_ranking, consentimento_saude_em, updated_at) on public.perfis to authenticated;

create policy "perfil: dona edita o seu" on public.perfis
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "perfil: admin edita todos" on public.perfis
  for update using (public.eh_admin());

-- Cria o perfil automaticamente quando um usuário é criado no Auth.
create or replace function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfis (id, nome) values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', ''));
  return new;
end;
$$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil_novo_usuario();
