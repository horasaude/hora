alter table public.push_inscricoes add column lembrete_live boolean not null default true;
alter table public.lives add column lembrete_push_em timestamptz;

create or replace function public.lembretes_de_live()
returns table (live uuid, tema text, data timestamptz, inscricao uuid, endpoint text, p256dh text, auth text)
language sql
stable
security definer
set search_path = public
as $$
  select l.id, l.tema, l.data, i.id, i.endpoint, i.p256dh, i.auth
  from public.lives l
  cross join public.push_inscricoes i
  join public.perfis p on p.id = i.perfil_id
  where l.publicado and l.lembrete_push_em is null
    and l.data between now() + interval '45 minutes' and now() + interval '75 minutes'
    and i.lembrete_live
    and p.acesso_inicio_em is not null and p.acesso_inicio_em <= now()
    and (p.acesso_fim_em is null or now() < p.acesso_fim_em)
    and p.acesso_suspenso_em is null;
$$;

revoke all on function public.lembretes_de_live() from public, anon, authenticated;
grant execute on function public.lembretes_de_live() to service_role;

do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron')
    and exists (select 1 from pg_available_extensions where name = 'pg_net') then
    perform cron.schedule(
      'lembrete-live',
      '*/10 * * * *',
      $cron$
        select net.http_post(
          url := 'https://zijtjwhvnhfarmfscmnr.supabase.co/functions/v1/lembrete-live',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-cron-segredo', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_segredo')
          ),
          body := '{}'::jsonb
        )
      $cron$
    );
  end if;
end;
$$;
