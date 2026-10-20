alter table public.lives
  add column profissionais text[] not null default '{}' check (profissionais <@ array['ana', 'clara', 'lais']),
  add column convite_seq integer not null default 0;

update public.lives set profissionais = array[profissional] where profissional is not null;

create table public.lives_salas (
  live_id uuid primary key references public.lives (id) on delete cascade,
  link_url text check (link_url ~ '^https://'),
  google_sala text,
  updated_at timestamptz not null default now()
);

insert into public.lives_salas (live_id, link_url, google_sala)
  select id, link_url, google_evento_id from public.lives
  where link_url is not null or google_evento_id is not null;

alter table public.lives_salas enable row level security;
revoke all on table public.lives_salas from public, anon, authenticated;
grant select on table public.lives_salas to authenticated;
grant all on table public.lives_salas to service_role;
create policy "salas: equipe lê" on public.lives_salas
  for select to authenticated using (public.eh_admin());

create table public.lives_convidadas (
  id uuid primary key default gen_random_uuid(),
  live_id uuid not null references public.lives (id) on delete cascade,
  nome text not null check (char_length(nome) between 1 and 120),
  email text not null check (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  created_at timestamptz not null default now(),
  unique (live_id, email)
);

alter table public.lives_convidadas enable row level security;
revoke all on table public.lives_convidadas from public, anon, authenticated;
grant select on table public.lives_convidadas to authenticated;
grant all on table public.lives_convidadas to service_role;
create policy "convidadas: equipe lê" on public.lives_convidadas
  for select to authenticated using (public.eh_admin());

alter table public.lives
  drop column profissional,
  drop column convidada,
  drop column link_url,
  drop column google_evento_id;

create or replace function public.salvar_convidadas(p_live uuid, p_lista jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if jsonb_typeof(p_lista) <> 'array' or jsonb_array_length(p_lista) > 20 then
    raise exception 'lista inválida' using errcode = '22023';
  end if;
  delete from public.lives_convidadas c
  where c.live_id = p_live
    and lower(c.email) not in (
      select lower(trim(x ->> 'email')) from jsonb_array_elements(p_lista) x
    );
  insert into public.lives_convidadas (live_id, nome, email)
  select p_live, trim(x ->> 'nome'), lower(trim(x ->> 'email'))
  from jsonb_array_elements(p_lista) x
  on conflict (live_id, email) do update set nome = excluded.nome;
end;
$$;

revoke all on function public.salvar_convidadas(uuid, jsonb) from public, anon;
grant execute on function public.salvar_convidadas(uuid, jsonb) to authenticated;

create or replace function public.lives_versao_convite()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.convite_seq := case when new.publicado then 1 else 0 end;
  else
    new.convite_seq := old.convite_seq + case
      when (new.publicado or old.publicado) and (
        new.publicado is distinct from old.publicado
        or new.data is distinct from old.data
        or new.duracao_minutos is distinct from old.duracao_minutos
        or new.tema is distinct from old.tema
      ) then 1 else 0 end;
  end if;
  return new;
end;
$$;

create trigger lives_versao_convite
  before insert or update on public.lives
  for each row execute function public.lives_versao_convite();

create table public.lives_convites (
  live_id uuid not null references public.lives (id) on delete cascade,
  email text not null,
  nome text,
  seq integer not null,
  metodo text not null check (metodo in ('REQUEST', 'CANCEL')),
  enviado_em timestamptz not null default now(),
  primary key (live_id, email)
);

alter table public.lives_convites enable row level security;
revoke all on table public.lives_convites from public, anon, authenticated;
grant all on table public.lives_convites to service_role;

create or replace function public.destinos_da_live(p_live uuid)
returns table (email text, nome text, papel text)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (lower(t.email)) lower(t.email), t.nome, t.papel
  from (
    select u.email::text as email, p.nome, 'equipe' as papel, 1 as ordem
    from public.perfis p join auth.users u on u.id = p.id
    where p.papel = 'admin'
    union all
    select c.email, c.nome, 'convidada', 2
    from public.lives_convidadas c
    where c.live_id = p_live
    union all
    select u.email::text, p.nome, 'aluna', 3
    from public.perfis p join auth.users u on u.id = p.id
    where p.papel = 'aluna'
      and p.acesso_inicio_em is not null and p.acesso_inicio_em <= now()
      and (p.acesso_fim_em is null or now() < p.acesso_fim_em)
      and p.acesso_suspenso_em is null
  ) t
  where t.email is not null and t.email <> ''
  order by lower(t.email), t.ordem;
$$;

create or replace function public.convites_pendentes(p_limite integer default 40)
returns table (
  live uuid, email text, nome text, metodo text, seq integer,
  tema text, data timestamptz, duracao_minutos integer
)
language sql
stable
security definer
set search_path = public
as $$
  with futuras as (
    select l.* from public.lives l where l.data > now()
  ),
  destinos as (
    select f.id as live, d.email, d.nome
    from futuras f cross join lateral public.destinos_da_live(f.id) d
    where f.publicado
  ),
  pendentes as (
    select d.live, d.email, d.nome, 'REQUEST' as metodo
    from destinos d
    join futuras f on f.id = d.live
    left join public.lives_convites c on c.live_id = d.live and c.email = d.email
    where c.live_id is null or c.seq < f.convite_seq or c.metodo = 'CANCEL'
    union all
    select c.live_id, c.email, c.nome, 'CANCEL'
    from public.lives_convites c
    join futuras f on f.id = c.live_id
    where c.metodo = 'REQUEST'
      and not exists (select 1 from destinos d where d.live = c.live_id and d.email = c.email)
  )
  select p.live, p.email, p.nome, p.metodo, f.convite_seq, f.tema, f.data, f.duracao_minutos
  from pendentes p join futuras f on f.id = p.live
  order by f.data, p.email
  limit greatest(1, least(p_limite, 200));
$$;

revoke all on function public.destinos_da_live(uuid), public.convites_pendentes(integer)
  from public, anon, authenticated;
grant execute on function public.destinos_da_live(uuid), public.convites_pendentes(integer)
  to service_role;

create or replace function public.entrar_live(p_live uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_live public.lives;
  v_lanc uuid;
begin
  if not public.tem_acesso_ativo() then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  select * into v_live from public.lives where id = p_live and publicado;
  if not found then
    raise exception 'live não encontrada' using errcode = 'P0002';
  end if;
  if now() < v_live.data - interval '30 minutes' or now() > v_live.data + make_interval(mins => v_live.duracao_minutos) then
    raise exception 'fora do horário da live' using errcode = '22023';
  end if;
  insert into public.lives_presencas (perfil_id, live_id) values (auth.uid(), p_live) on conflict do nothing;
  v_lanc := public.conceder_pontos(auth.uid(), 'live', 'live', p_live::text);
  return jsonb_build_object(
    'link', (select s.link_url from public.lives_salas s where s.live_id = p_live),
    'pontos', coalesce((select l.pontos from public.lancamentos_pontos l where l.id = v_lanc), 0)
  );
end;
$$;

do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron')
    and exists (select 1 from pg_available_extensions where name = 'pg_net') then
    perform cron.schedule(
      'convites-live',
      '* * * * *',
      $cron$
        select net.http_post(
          url := 'https://zijtjwhvnhfarmfscmnr.supabase.co/functions/v1/convites-live',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-cron-segredo', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_segredo')
          ),
          body := '{}'::jsonb
        )
        where exists (select 1 from public.convites_pendentes(1))
      $cron$
    );
  end if;
end;
$$;
