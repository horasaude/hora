create table public.exercicios (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 120),
  grupo text not null check (grupo in (
    'peito', 'costas', 'ombro', 'biceps', 'triceps', 'abdomen', 'gluteo', 'quadriceps',
    'posterior', 'panturrilha', 'corpo_todo', 'cardio', 'mobilidade'
  )),
  equipamento text not null default 'sem' check (equipamento in ('sem', 'halter', 'elastico', 'barra', 'maquina', 'banco', 'outro')),
  video_url text not null default '' check (video_url = '' or video_url ~ '^https://'),
  foto_path text check (foto_path like 'exercicios/%'),
  instrucoes text not null default '' check (char_length(instrucoes) <= 3000),
  erros_comuns text not null default '' check (char_length(erros_comuns) <= 3000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.treinos (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 120),
  tema_id uuid not null references public.temas (id) on delete restrict,
  nivel text not null check (nivel in ('iniciante', 'intermediario', 'avancado')),
  local text not null check (local in ('casa', 'academia')),
  duracao_minutos integer check (duracao_minutos between 1 and 300),
  descricao text not null default '' check (char_length(descricao) <= 500),
  aquecimento text not null default '' check (char_length(aquecimento) <= 2000),
  alongamento text not null default '' check (char_length(alongamento) <= 2000),
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index treinos_tema on public.treinos (tema_id, nivel, local);

create table public.treino_exercicios (
  id uuid primary key default gen_random_uuid(),
  treino_id uuid not null references public.treinos (id) on delete cascade,
  exercicio_id uuid not null references public.exercicios (id) on delete restrict,
  ordem integer not null default 0,
  series integer not null default 3 check (series between 1 and 20),
  repeticoes text not null default '12' check (char_length(repeticoes) between 1 and 40),
  carga text not null default '' check (char_length(carga) <= 80),
  descanso_segundos integer not null default 60 check (descanso_segundos between 0 and 600),
  observacao text not null default '' check (char_length(observacao) <= 300)
);
create index treino_exercicios_treino on public.treino_exercicios (treino_id, ordem);

create table public.rotinas (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 120),
  tema_id uuid not null references public.temas (id) on delete restrict,
  nivel text not null check (nivel in ('iniciante', 'intermediario', 'avancado')),
  local text not null check (local in ('casa', 'academia')),
  descricao text not null default '' check (char_length(descricao) <= 500),
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rotina_treinos (
  id uuid primary key default gen_random_uuid(),
  rotina_id uuid not null references public.rotinas (id) on delete cascade,
  treino_id uuid not null references public.treinos (id) on delete cascade,
  dia_semana integer not null check (dia_semana between 0 and 6),
  unique (rotina_id, dia_semana)
);

create table public.treinos_feitos (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  treino_id uuid not null references public.treinos (id) on delete cascade,
  data date not null default public.hoje_brasilia(),
  series jsonb not null default '{}'::jsonb check (jsonb_typeof(series) = 'object'),
  concluido_em timestamptz,
  created_at timestamptz not null default now(),
  unique (perfil_id, treino_id, data)
);
create index treinos_feitos_perfil on public.treinos_feitos (perfil_id, data);
create index treinos_feitos_concluido on public.treinos_feitos (concluido_em);

alter table public.perfis
  add column treino_nivel text check (treino_nivel in ('iniciante', 'intermediario', 'avancado')),
  add column treino_local text check (treino_local in ('casa', 'academia'));
grant update (treino_nivel, treino_local) on public.perfis to authenticated;

create trigger exercicios_updated_at before update on public.exercicios for each row execute function public.tocar_updated_at();
create trigger treinos_updated_at before update on public.treinos for each row execute function public.tocar_updated_at();
create trigger rotinas_updated_at before update on public.rotinas for each row execute function public.tocar_updated_at();

create or replace function public.tema_do_treino_da_aluna()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select t.id from public.perfis p join public.temas t on t.id = p.tema_atual_id and t.tipo = 'tema' where p.id = auth.uid()),
    (select id from public.temas where tipo = 'preparacao' order by ordem limit 1)
  );
$$;

create or replace function public.treino_visivel(p_treino uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.treinos t
    where t.id = p_treino and t.publicado and public.tem_acesso_ativo()
      and t.tema_id = public.tema_do_treino_da_aluna()
  );
$$;

alter table public.exercicios enable row level security;
alter table public.treinos enable row level security;
alter table public.treino_exercicios enable row level security;
alter table public.rotinas enable row level security;
alter table public.rotina_treinos enable row level security;
alter table public.treinos_feitos enable row level security;

revoke all on public.exercicios, public.treinos, public.treino_exercicios, public.rotinas, public.rotina_treinos, public.treinos_feitos from anon, authenticated;
grant select, insert, update, delete on public.exercicios, public.treinos, public.treino_exercicios, public.rotinas, public.rotina_treinos to authenticated;
grant select, insert, update on public.treinos_feitos to authenticated;

create policy "exercicios: admin edita" on public.exercicios
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "exercicios: aluna com acesso lê os dos treinos dela" on public.exercicios
  for select to authenticated using (
    public.tem_acesso_ativo() and exists (
      select 1 from public.treino_exercicios te where te.exercicio_id = exercicios.id and public.treino_visivel(te.treino_id)
    )
  );

create policy "treinos: admin edita" on public.treinos
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "treinos: aluna lê publicados do tema dela" on public.treinos
  for select to authenticated using (public.treino_visivel(id));

create policy "treino_exercicios: admin edita" on public.treino_exercicios
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "treino_exercicios: aluna lê os do treino visível" on public.treino_exercicios
  for select to authenticated using (public.treino_visivel(treino_id));

create policy "rotinas: admin edita" on public.rotinas
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "rotinas: aluna lê publicadas do tema dela" on public.rotinas
  for select to authenticated using (
    publicado and public.tem_acesso_ativo() and tema_id = public.tema_do_treino_da_aluna()
  );

create policy "rotina_treinos: admin edita" on public.rotina_treinos
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "rotina_treinos: aluna lê os da rotina visível" on public.rotina_treinos
  for select to authenticated using (
    public.treino_visivel(treino_id) and exists (
      select 1 from public.rotinas r where r.id = rotina_id and r.publicado and r.tema_id = public.tema_do_treino_da_aluna()
    )
  );

create policy "treinos_feitos: dona e admin leem" on public.treinos_feitos
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "treinos_feitos: dona registra treino visível" on public.treinos_feitos
  for insert to authenticated with check (perfil_id = auth.uid() and public.treino_visivel(treino_id));
create policy "treinos_feitos: dona atualiza o seu" on public.treinos_feitos
  for update to authenticated using (perfil_id = auth.uid())
  with check (perfil_id = auth.uid() and public.treino_visivel(treino_id));

create or replace function public.salvar_treino(p_treino jsonb, p_itens jsonb)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_id uuid := nullif(p_treino ->> 'id', '')::uuid;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if v_id is null then
    insert into public.treinos (nome, tema_id, nivel, local, duracao_minutos, descricao, aquecimento, alongamento, publicado)
    values (p_treino ->> 'nome', (p_treino ->> 'tema_id')::uuid, p_treino ->> 'nivel', p_treino ->> 'local',
      nullif(p_treino ->> 'duracao_minutos', '')::integer, coalesce(p_treino ->> 'descricao', ''),
      coalesce(p_treino ->> 'aquecimento', ''), coalesce(p_treino ->> 'alongamento', ''),
      coalesce((p_treino ->> 'publicado')::boolean, false))
    returning id into v_id;
  else
    update public.treinos set
      nome = p_treino ->> 'nome', tema_id = (p_treino ->> 'tema_id')::uuid, nivel = p_treino ->> 'nivel',
      local = p_treino ->> 'local', duracao_minutos = nullif(p_treino ->> 'duracao_minutos', '')::integer,
      descricao = coalesce(p_treino ->> 'descricao', ''), aquecimento = coalesce(p_treino ->> 'aquecimento', ''),
      alongamento = coalesce(p_treino ->> 'alongamento', ''), publicado = coalesce((p_treino ->> 'publicado')::boolean, false)
    where id = v_id;
  end if;
  delete from public.treino_exercicios where treino_id = v_id;
  insert into public.treino_exercicios (treino_id, exercicio_id, ordem, series, repeticoes, carga, descanso_segundos, observacao)
  select v_id, (i ->> 'exercicio_id')::uuid, (ordinality - 1)::integer, coalesce((i ->> 'series')::integer, 3),
    coalesce(nullif(i ->> 'repeticoes', ''), '12'), coalesce(i ->> 'carga', ''),
    coalesce((i ->> 'descanso_segundos')::integer, 60), coalesce(i ->> 'observacao', '')
  from jsonb_array_elements(coalesce(p_itens, '[]'::jsonb)) with ordinality as e(i, ordinality);
  return v_id;
end;
$$;

create or replace function public.salvar_rotina(p_rotina jsonb, p_dias jsonb)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_id uuid := nullif(p_rotina ->> 'id', '')::uuid;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if v_id is null then
    insert into public.rotinas (nome, tema_id, nivel, local, descricao, publicado)
    values (p_rotina ->> 'nome', (p_rotina ->> 'tema_id')::uuid, p_rotina ->> 'nivel', p_rotina ->> 'local',
      coalesce(p_rotina ->> 'descricao', ''), coalesce((p_rotina ->> 'publicado')::boolean, false))
    returning id into v_id;
  else
    update public.rotinas set nome = p_rotina ->> 'nome', tema_id = (p_rotina ->> 'tema_id')::uuid,
      nivel = p_rotina ->> 'nivel', local = p_rotina ->> 'local', descricao = coalesce(p_rotina ->> 'descricao', ''),
      publicado = coalesce((p_rotina ->> 'publicado')::boolean, false)
    where id = v_id;
  end if;
  delete from public.rotina_treinos where rotina_id = v_id;
  insert into public.rotina_treinos (rotina_id, treino_id, dia_semana)
  select v_id, (d ->> 'treino_id')::uuid, (d ->> 'dia_semana')::integer
  from jsonb_array_elements(coalesce(p_dias, '[]'::jsonb)) as e(d);
  return v_id;
end;
$$;

create or replace function public.resumo_treinos()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'publicados', (select count(*) from public.treinos where publicado),
    'exercicios', (select count(*) from public.exercicios),
    'feitos_7_dias', (select count(*) from public.treinos_feitos where concluido_em >= now() - interval '7 days')
  );
end;
$$;

revoke all on function public.tema_do_treino_da_aluna(), public.treino_visivel(uuid), public.salvar_treino(jsonb, jsonb),
  public.salvar_rotina(jsonb, jsonb), public.resumo_treinos() from public, anon;
grant execute on function public.tema_do_treino_da_aluna(), public.treino_visivel(uuid), public.salvar_treino(jsonb, jsonb),
  public.salvar_rotina(jsonb, jsonb), public.resumo_treinos() to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('treinos', 'treinos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
create policy "treinos fotos: admin envia" on storage.objects
  for insert to authenticated with check (bucket_id = 'treinos' and public.eh_admin());
create policy "treinos fotos: admin altera" on storage.objects
  for update to authenticated using (bucket_id = 'treinos' and public.eh_admin());
create policy "treinos fotos: admin apaga" on storage.objects
  for delete to authenticated using (bucket_id = 'treinos' and public.eh_admin());
create policy "treinos fotos: equipe e aluna com acesso veem" on storage.objects
  for select to authenticated using (bucket_id = 'treinos' and (public.eh_admin() or public.tem_acesso_ativo()));

insert into public.exercicios (nome, grupo, equipamento) values
  ('Agachamento livre', 'quadriceps', 'sem'),
  ('Agachamento sumô com halter', 'quadriceps', 'halter'),
  ('Afundo alternado', 'quadriceps', 'sem'),
  ('Cadeira extensora', 'quadriceps', 'maquina'),
  ('Leg press 45', 'quadriceps', 'maquina'),
  ('Ponte de glúteo', 'gluteo', 'sem'),
  ('Elevação pélvica com barra', 'gluteo', 'barra'),
  ('Abdução de quadril com elástico', 'gluteo', 'elastico'),
  ('Coice de glúteo em quatro apoios', 'gluteo', 'sem'),
  ('Stiff com halteres', 'posterior', 'halter'),
  ('Mesa flexora', 'posterior', 'maquina'),
  ('Elevação de panturrilha em pé', 'panturrilha', 'sem'),
  ('Flexão de braços com joelhos apoiados', 'peito', 'sem'),
  ('Supino reto com halteres', 'peito', 'halter'),
  ('Crucifixo com halteres', 'peito', 'banco'),
  ('Remada curvada com halteres', 'costas', 'halter'),
  ('Remada com elástico', 'costas', 'elastico'),
  ('Puxada frontal', 'costas', 'maquina'),
  ('Desenvolvimento com halteres', 'ombro', 'halter'),
  ('Elevação lateral', 'ombro', 'halter'),
  ('Rosca direta com halteres', 'biceps', 'halter'),
  ('Rosca martelo', 'biceps', 'halter'),
  ('Tríceps no banco', 'triceps', 'banco'),
  ('Tríceps francês com halter', 'triceps', 'halter'),
  ('Prancha frontal', 'abdomen', 'sem'),
  ('Abdominal remador', 'abdomen', 'sem'),
  ('Polichinelo', 'cardio', 'sem'),
  ('Caminhada estacionária', 'cardio', 'sem'),
  ('Burpee adaptado', 'corpo_todo', 'sem'),
  ('Mobilidade de quadril', 'mobilidade', 'sem');
