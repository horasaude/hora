create table public.arquivos_aluna (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  nome text not null check (char_length(nome) between 1 and 160),
  caminho text not null unique check (char_length(caminho) <= 300 and split_part(caminho, '/', 1) = perfil_id::text),
  tipo text not null check (tipo in ('pdf', 'imagem', 'word')),
  tamanho bigint check (tamanho between 1 and 20971520),
  enviado_por uuid default auth.uid() references public.perfis (id) on delete set null,
  created_at timestamptz not null default now()
);
create index arquivos_aluna_perfil on public.arquivos_aluna (perfil_id, created_at desc);

alter table public.arquivos_aluna enable row level security;
revoke all on public.arquivos_aluna from anon, authenticated;
grant select, insert, delete on public.arquivos_aluna to authenticated;

create policy "arquivos_aluna: admin gerencia" on public.arquivos_aluna
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "arquivos_aluna: dona com acesso lê os seus" on public.arquivos_aluna
  for select to authenticated using (perfil_id = auth.uid() and public.tem_acesso_ativo());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('arquivos_aluna', 'arquivos_aluna', false, 20971520, array[
  'application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
])
on conflict (id) do nothing;

create policy "arquivos da aluna: admin envia" on storage.objects
  for insert to authenticated with check (bucket_id = 'arquivos_aluna' and public.eh_admin());
create policy "arquivos da aluna: admin apaga" on storage.objects
  for delete to authenticated using (bucket_id = 'arquivos_aluna' and public.eh_admin());
create policy "arquivos da aluna: dona com acesso e admin leem" on storage.objects
  for select to authenticated using (
    bucket_id = 'arquivos_aluna'
    and (public.eh_admin() or (split_part(name, '/', 1) = auth.uid()::text and public.tem_acesso_ativo()))
  );
