alter table public.aulas alter column video_url set default '';
alter table public.aulas drop constraint aulas_video_url_check;
alter table public.aulas add constraint aulas_video_url_check check (video_url = '' or video_url ~ '^https://');
