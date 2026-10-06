alter table public.perfis
  add column acesso_inicio date,
  add column acesso_fim date,
  add constraint perfis_acesso_periodo check (acesso_fim is null or acesso_inicio is null or acesso_fim >= acesso_inicio);

create or replace function public.hoje_brasilia()
returns date
language sql
stable
as $$
  select (now() at time zone 'America/Sao_Paulo')::date;
$$;

create or replace function public.tem_acesso_ativo()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfis
    where id = auth.uid()
      and acesso_inicio is not null
      and acesso_inicio <= public.hoje_brasilia()
      and (acesso_fim is null or acesso_fim >= public.hoje_brasilia())
  );
$$;

create or replace function public.dia_de_acesso()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select (public.hoje_brasilia() - acesso_inicio) + 1
  from public.perfis
  where id = auth.uid() and public.tem_acesso_ativo();
$$;

create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.temas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null check (char_length(titulo) between 1 and 120),
  descricao text not null default '' check (char_length(descricao) <= 2000),
  ordem integer not null default 0,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.etapas (
  id uuid primary key default gen_random_uuid(),
  tema_id uuid not null references public.temas (id) on delete cascade,
  titulo text not null check (char_length(titulo) between 1 and 120),
  descricao text not null default '' check (char_length(descricao) <= 2000),
  ordem integer not null check (ordem >= 1),
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tema_id, ordem)
);

create table public.aulas (
  id uuid primary key default gen_random_uuid(),
  etapa_id uuid not null references public.etapas (id) on delete cascade,
  titulo text not null check (char_length(titulo) between 1 and 160),
  descricao text not null default '' check (char_length(descricao) <= 5000),
  video_url text not null check (video_url ~ '^https://'),
  material_url text check (material_url ~ '^https://'),
  dia_liberacao integer not null check (dia_liberacao >= 1),
  ordem integer not null default 0,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lives (
  id uuid primary key default gen_random_uuid(),
  tema text not null check (char_length(tema) between 1 and 160),
  data timestamptz not null,
  convidada text check (char_length(convidada) <= 120),
  link_url text check (link_url ~ '^https://'),
  gravacao_url text check (gravacao_url ~ '^https://'),
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.avisos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null check (char_length(titulo) between 1 and 160),
  texto text not null check (char_length(texto) between 1 and 5000),
  publicar_em timestamptz not null default now(),
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index etapas_tema_idx on public.etapas (tema_id, ordem);
create index aulas_etapa_idx on public.aulas (etapa_id, dia_liberacao, ordem);
create index lives_data_idx on public.lives (data);
create index avisos_publicar_em_idx on public.avisos (publicar_em desc);

create trigger temas_updated_at before update on public.temas for each row execute function public.tocar_updated_at();
create trigger etapas_updated_at before update on public.etapas for each row execute function public.tocar_updated_at();
create trigger aulas_updated_at before update on public.aulas for each row execute function public.tocar_updated_at();
create trigger lives_updated_at before update on public.lives for each row execute function public.tocar_updated_at();
create trigger avisos_updated_at before update on public.avisos for each row execute function public.tocar_updated_at();

alter table public.temas enable row level security;
alter table public.etapas enable row level security;
alter table public.aulas enable row level security;
alter table public.lives enable row level security;
alter table public.avisos enable row level security;

revoke all on public.temas, public.etapas, public.aulas, public.lives, public.avisos from anon, authenticated;
grant select, insert, update, delete on public.temas, public.etapas, public.aulas, public.lives, public.avisos to authenticated;

revoke all on function public.tem_acesso_ativo(), public.dia_de_acesso() from public, anon;
grant execute on function public.tem_acesso_ativo(), public.dia_de_acesso() to authenticated, service_role;

create policy "temas: admin gerencia" on public.temas
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "temas: aluna lê publicados" on public.temas
  for select to authenticated using (publicado and public.tem_acesso_ativo());

create policy "etapas: admin gerencia" on public.etapas
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "etapas: aluna lê publicadas" on public.etapas
  for select to authenticated using (
    publicado
    and public.tem_acesso_ativo()
    and exists (select 1 from public.temas t where t.id = tema_id and t.publicado)
  );

create policy "aulas: admin gerencia" on public.aulas
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "aulas: aluna lê liberadas" on public.aulas
  for select to authenticated using (
    publicado
    and dia_liberacao <= coalesce(public.dia_de_acesso(), 0)
    and exists (
      select 1 from public.etapas e join public.temas t on t.id = e.tema_id
      where e.id = etapa_id and e.publicado and t.publicado
    )
  );

create policy "lives: admin gerencia" on public.lives
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "lives: aluna lê publicadas" on public.lives
  for select to authenticated using (publicado and public.tem_acesso_ativo());

create policy "avisos: admin gerencia" on public.avisos
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "avisos: aluna lê publicados" on public.avisos
  for select to authenticated using (publicado and publicar_em <= now() and public.tem_acesso_ativo());
