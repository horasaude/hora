alter table public.cardapios
  add column pdf_path text,
  add column pdf_nome text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cardapios', 'cardapios', false, 20971520, array['application/pdf'])
on conflict (id) do nothing;

create policy "cardapios pdf: admin gerencia" on storage.objects
  for all to authenticated
  using (bucket_id = 'cardapios' and public.eh_admin())
  with check (bucket_id = 'cardapios' and public.eh_admin());
create policy "cardapios pdf: aluna lê de cardápio publicado" on storage.objects
  for select to authenticated using (
    bucket_id = 'cardapios'
    and public.tem_acesso_ativo()
    and exists (
      select 1 from public.cardapios c
      where c.pdf_path = name and c.publicado and public.tema_aberto(c.tema_id)
    )
  );
