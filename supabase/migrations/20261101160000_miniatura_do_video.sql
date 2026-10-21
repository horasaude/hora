create or replace function public.aulas_do_tema(p_tema uuid, p_aberto boolean, p_aluna boolean)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'titulo', a.titulo, 'profissional', a.profissional, 'duracao_minutos', a.duracao_minutos,
    'dia_liberacao', a.dia_liberacao, 'ordem', a.ordem, 'capa', a.capa_path,
    'miniatura', case when p_aberto and not public.fechado(a.bloqueado, a.libera_em) then
      'https://i.ytimg.com/vi/'
        || substring(a.video_url from '(?:youtu\.be/|[?&]v=|/embed/|/shorts/|/live/)([A-Za-z0-9_-]{11})')
        || '/hqdefault.jpg'
    end,
    'liberada', p_aberto and not public.fechado(a.bloqueado, a.libera_em),
    'em_breve', public.fechado(a.bloqueado, a.libera_em),
    'concluida', p_aluna and exists (
      select 1 from public.aulas_concluidas c where c.aula_id = a.id and c.perfil_id = auth.uid())
  ) order by e.ordem, a.ordem, a.created_at), '[]'::jsonb)
  from public.aulas a join public.etapas e on e.id = a.etapa_id
  where e.tema_id = p_tema and a.publicado;
$$;
revoke all on function public.aulas_do_tema(uuid, boolean, boolean) from public, anon, authenticated;
