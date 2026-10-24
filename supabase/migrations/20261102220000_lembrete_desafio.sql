create or replace function public.lembretes_de_desafio()
returns table (inscricao uuid, endpoint text, p256dh text, auth text, desafio uuid, nome text, premio text)
language sql
stable
security definer
set search_path = public
as $$
  with base as (
    select i.id as inscricao, i.endpoint, i.p256dh, i.auth, p.id as perfil, d.id as desafio, d.nome,
      trim(d.premio) as premio,
      case when d.tema_id is null then d.inicio
        else (p.acesso_inicio_em at time zone 'America/Sao_Paulo')::date + public.inicio_do_tema(d.tema_id) - 1 end as inicio,
      case when d.tema_id is null then d.fim
        else (p.acesso_inicio_em at time zone 'America/Sao_Paulo')::date + public.inicio_do_tema(d.tema_id) - 1
          + t.dias_liberado - 1 end as fim
    from public.push_inscricoes i
    join public.perfis p on p.id = i.perfil_id
    join public.desafios d on d.publicado and d.encerrado_em is null
    left join public.temas t on t.id = d.tema_id
    where p.acesso_inicio_em is not null and p.acesso_inicio_em <= now()
      and (p.acesso_fim_em is null or now() < p.acesso_fim_em)
      and p.acesso_suspenso_em is null
      and (d.tema_id is null or (t.publicado and not public.fechado(t.bloqueado, t.libera_em)))
      and (
        exists (select 1 from public.desafio_participantes dp where dp.desafio_id = d.id and dp.perfil_id = p.id)
        or exists (select 1 from public.desafio_checkins c where c.desafio_id = d.id and c.perfil_id = p.id)
      )
  )
  select distinct on (b.inscricao) b.inscricao, b.endpoint, b.p256dh, b.auth, b.desafio, b.nome, b.premio
  from base b
  where public.hoje_brasilia() between b.inicio and b.fim
    and not exists (
      select 1 from public.desafio_checkins c
      where c.desafio_id = b.desafio and c.perfil_id = b.perfil and c.dia = public.hoje_brasilia()
    )
  order by b.inscricao, b.fim, b.nome;
$$;

revoke all on function public.lembretes_de_desafio() from public, anon, authenticated;
grant execute on function public.lembretes_de_desafio() to service_role;

do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron')
    and exists (select 1 from pg_available_extensions where name = 'pg_net') then
    perform cron.schedule(
      'lembrete-desafio',
      '0 22 * * *',
      $cron$
        select net.http_post(
          url := 'https://zijtjwhvnhfarmfscmnr.supabase.co/functions/v1/lembrete-desafio',
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
