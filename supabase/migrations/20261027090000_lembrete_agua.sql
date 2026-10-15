create table public.push_inscricoes (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  endpoint text not null unique check (char_length(endpoint) <= 1000 and endpoint like 'https://%'),
  p256dh text not null check (char_length(p256dh) <= 200),
  auth text not null check (char_length(auth) <= 100),
  lembrete_agua boolean not null default true,
  created_at timestamptz not null default now()
);
create index push_inscricoes_perfil on public.push_inscricoes (perfil_id);

alter table public.push_inscricoes enable row level security;
revoke all on public.push_inscricoes from anon, authenticated;
grant select, insert, update, delete on public.push_inscricoes to authenticated;
create policy "push_inscricoes: dona cuida das suas" on public.push_inscricoes
  for all to authenticated using (perfil_id = auth.uid()) with check (perfil_id = auth.uid());

create or replace function public.lembretes_de_agua()
returns table (inscricao uuid, endpoint text, p256dh text, auth text, total integer, meta integer)
language sql
stable
security definer
set search_path = public
as $$
  with meta as (select coalesce((select agua_meta_ml from public.configuracoes limit 1), 2000) as ml),
  bebido as (
    select a.perfil_id, sum(a.ml)::integer as ml from public.agua_registros a
    where a.dia = public.hoje_brasilia() group by a.perfil_id
  )
  select i.id, i.endpoint, i.p256dh, i.auth, coalesce(b.ml, 0), m.ml
  from public.push_inscricoes i
  join public.perfis p on p.id = i.perfil_id
  cross join meta m
  left join bebido b on b.perfil_id = i.perfil_id
  where i.lembrete_agua
    and p.acesso_inicio_em is not null and p.acesso_inicio_em <= now()
    and (p.acesso_fim_em is null or now() < p.acesso_fim_em)
    and p.acesso_suspenso_em is null
    and coalesce(b.ml, 0) < m.ml;
$$;

revoke all on function public.lembretes_de_agua() from public, anon, authenticated;
grant execute on function public.lembretes_de_agua() to service_role;

do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron')
    and exists (select 1 from pg_available_extensions where name = 'pg_net') then
    perform cron.schedule(
      'lembrete-agua',
      '0 12,14,16,18,20,22 * * *',
      $cron$
        select net.http_post(
          url := 'https://zijtjwhvnhfarmfscmnr.supabase.co/functions/v1/lembrete-agua',
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
