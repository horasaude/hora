alter table public.lives_salas add column conta text;

create or replace function public.gravacoes_pendentes()
returns table (live uuid, sala text, inicio timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select l.id, s.google_sala, l.data
  from public.lives l
  join public.lives_salas s on s.live_id = l.id
  where l.publicado
    and l.gravacao_url is null
    and s.google_sala is not null
    and now() > l.data + make_interval(mins => l.duracao_minutos) + interval '10 minutes'
    and now() < l.data + make_interval(mins => l.duracao_minutos) + interval '3 days'
  order by l.data;
$$;

revoke all on function public.gravacoes_pendentes() from public, anon, authenticated;
grant execute on function public.gravacoes_pendentes() to service_role;

do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron')
    and exists (select 1 from pg_available_extensions where name = 'pg_net') then
    perform cron.schedule(
      'gravacao-live',
      '*/10 * * * *',
      $cron$
        select net.http_post(
          url := 'https://zijtjwhvnhfarmfscmnr.supabase.co/functions/v1/gravacao-live',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-cron-segredo', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_segredo')
          ),
          body := '{}'::jsonb
        )
        where exists (select 1 from public.gravacoes_pendentes())
      $cron$
    );
  end if;
end;
$$;
