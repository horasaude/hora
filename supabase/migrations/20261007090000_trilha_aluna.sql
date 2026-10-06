alter table public.aulas
  add column duracao_minutos integer check (duracao_minutos between 1 and 600),
  add column profissional text check (char_length(profissional) <= 80);

create table public.aulas_concluidas (
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  aula_id uuid not null references public.aulas (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (perfil_id, aula_id)
);

alter table public.aulas_concluidas enable row level security;

revoke all on public.aulas_concluidas from anon, authenticated;
grant select, insert, delete on public.aulas_concluidas to authenticated;

create policy "concluidas: dona lê as suas" on public.aulas_concluidas
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "concluidas: dona marca aula liberada" on public.aulas_concluidas
  for insert to authenticated with check (
    perfil_id = auth.uid()
    and exists (select 1 from public.aulas a where a.id = aula_id)
  );
create policy "concluidas: dona desmarca" on public.aulas_concluidas
  for delete to authenticated using (perfil_id = auth.uid());

create or replace function public.minha_trilha()
returns table (
  id uuid,
  tema_id uuid,
  tema_titulo text,
  tema_ordem integer,
  etapa_id uuid,
  etapa_titulo text,
  etapa_ordem integer,
  titulo text,
  profissional text,
  duracao_minutos integer,
  dia_liberacao integer,
  ordem integer,
  liberada boolean,
  concluida boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    a.id, t.id, t.titulo, t.ordem, e.id, e.titulo, e.ordem,
    a.titulo, a.profissional, a.duracao_minutos, a.dia_liberacao, a.ordem,
    a.dia_liberacao <= public.dia_de_acesso(),
    exists (select 1 from public.aulas_concluidas c where c.aula_id = a.id and c.perfil_id = auth.uid())
  from public.aulas a
  join public.etapas e on e.id = a.etapa_id
  join public.temas t on t.id = e.tema_id
  where public.tem_acesso_ativo() and a.publicado and e.publicado and t.publicado
  order by t.ordem, t.created_at, e.ordem, a.ordem, a.created_at;
$$;

revoke all on function public.minha_trilha() from public, anon;
grant execute on function public.minha_trilha() to authenticated;
