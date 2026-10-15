insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatares', 'avatares', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "avatares: dona envia na pasta dela" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatares' and split_part(name, '/', 1) = auth.uid()::text);
create policy "avatares: dona apaga" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatares' and split_part(name, '/', 1) = auth.uid()::text);
create policy "avatares: comunidade com acesso vê" on storage.objects
  for select to authenticated
  using (bucket_id = 'avatares' and (public.tem_acesso_ativo() or public.eh_admin() or split_part(name, '/', 1) = auth.uid()::text));

drop function public.ranking_pontos(text);

create or replace function public.ranking_pontos(p_periodo text)
returns table (posicao integer, apelido text, pontos integer, eu boolean, avatar_path text)
language sql
stable
security definer
set search_path = public
as $$
  with inicio as (
    select case when p_periodo = 'ano' then date_trunc('year', public.hoje_brasilia())::date
      else date_trunc('month', public.hoje_brasilia())::date end as dia
  ),
  somas as (
    select l.perfil_id, sum(l.pontos)::integer as total
    from public.lancamentos_pontos l, inicio i
    where l.dia >= i.dia
    group by l.perfil_id
  ),
  gente as (
    select p.id, coalesce(nullif(p.apelido, ''), 'aluna') as nome, coalesce(s.total, 0) as total, p.avatar_path
    from public.perfis p left join somas s on s.perfil_id = p.id
    where (p.papel = 'aluna' or p.id = auth.uid())
      and (p.id = auth.uid() or (not p.ocultar_ranking and coalesce(s.total, 0) > 0))
  )
  select (row_number() over (order by g.total desc, g.nome))::integer, g.nome, g.total, g.id = auth.uid(), g.avatar_path
  from gente g
  where public.eh_admin() or public.tem_acesso_ativo()
  order by 1;
$$;

revoke all on function public.ranking_pontos(text) from public, anon;
grant execute on function public.ranking_pontos(text) to authenticated;
