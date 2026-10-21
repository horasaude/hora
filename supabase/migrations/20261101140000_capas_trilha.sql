alter table public.temas add column capa_path text check (capa_path is null or capa_path ~ '^temas/[0-9a-f-]+\.(jpg|png|webp)$');
alter table public.aulas add column capa_path text check (capa_path is null or capa_path ~ '^aulas/[0-9a-f-]+\.(jpg|png|webp)$');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('capas', 'capas', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
create policy "capas: admin envia" on storage.objects
  for insert to authenticated with check (bucket_id = 'capas' and public.eh_admin());
create policy "capas: admin altera" on storage.objects
  for update to authenticated using (bucket_id = 'capas' and public.eh_admin());
create policy "capas: admin apaga" on storage.objects
  for delete to authenticated using (bucket_id = 'capas' and public.eh_admin());
create policy "capas: admin lê" on storage.objects
  for select to authenticated using (bucket_id = 'capas' and public.eh_admin());

create or replace function public.aulas_da_etapa(p_etapa uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'titulo', a.titulo, 'profissional', a.profissional, 'duracao_minutos', a.duracao_minutos,
    'dia_liberacao', a.dia_liberacao, 'ordem', a.ordem, 'capa', a.capa_path, 'liberada', public.aula_liberada(a.id),
    'em_breve', public.fechado(a.bloqueado, a.libera_em) or public.fechado(t.bloqueado, t.libera_em),
    'concluida', exists (select 1 from public.aulas_concluidas c where c.aula_id = a.id and c.perfil_id = auth.uid())
  ) order by a.dia_liberacao, a.ordem, a.created_at), '[]'::jsonb)
  from public.aulas a
  join public.etapas e on e.id = a.etapa_id
  join public.temas t on t.id = e.tema_id
  where a.etapa_id = p_etapa and a.publicado;
$$;

create or replace function public.aulas_previa(p_etapa uuid, p_dia integer)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'titulo', a.titulo, 'profissional', a.profissional, 'duracao_minutos', a.duracao_minutos,
    'dia_liberacao', a.dia_liberacao, 'ordem', a.ordem, 'capa', a.capa_path,
    'liberada', p_dia is not null and a.dia_liberacao <= p_dia
      and not public.fechado(a.bloqueado, a.libera_em) and not public.fechado(t.bloqueado, t.libera_em),
    'em_breve', public.fechado(a.bloqueado, a.libera_em) or public.fechado(t.bloqueado, t.libera_em),
    'concluida', false
  ) order by a.dia_liberacao, a.ordem, a.created_at), '[]'::jsonb)
  from public.aulas a
  join public.etapas e on e.id = a.etapa_id
  join public.temas t on t.id = e.tema_id
  where a.etapa_id = p_etapa and a.publicado;
$$;
revoke all on function public.aulas_previa(uuid, integer) from public, anon, authenticated;

create or replace function public.temas_da_trilha()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'chave', t.chave, 'cor', t.cor, 'titulo', t.titulo, 'frase', t.descricao, 'capa', t.capa_path,
    'em_breve', public.fechado(t.bloqueado, t.libera_em)
  ) order by t.ordem), '[]'::jsonb)
  from public.temas t where t.tipo = 'tema' and t.publicado;
$$;
revoke all on function public.temas_da_trilha() from public, anon, authenticated;
