create table public.aula_materiais (
  id uuid primary key default gen_random_uuid(),
  aula_id uuid not null references public.aulas (id) on delete cascade,
  tipo text not null check (tipo in ('pdf', 'imagem', 'link')),
  caminho text not null check (char_length(caminho) between 1 and 500),
  nome text not null check (char_length(nome) between 1 and 160),
  tamanho bigint check (tamanho between 0 and 20971520),
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  check ((tipo = 'link') = (caminho ~ '^https://')),
  check (tipo = 'link' or caminho like 'aulas/%')
);
create index aula_materiais_aula_idx on public.aula_materiais (aula_id, ordem);

insert into public.aula_materiais (aula_id, tipo, caminho, nome, ordem)
select id, 'link', material_url, 'Material da aula', 0 from public.aulas where material_url is not null;
alter table public.aulas drop column material_url;

alter table public.aula_materiais enable row level security;
revoke all on public.aula_materiais from anon, authenticated;
grant select, insert, update, delete on public.aula_materiais to authenticated;

create policy "materiais: admin gerencia" on public.aula_materiais
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "materiais: aluna lê os da aula liberada" on public.aula_materiais
  for select to authenticated using (public.aula_liberada(aula_id));

create or replace function public.salvar_materiais(p_aula uuid, p_itens jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  delete from public.aula_materiais where aula_id = p_aula;
  insert into public.aula_materiais (aula_id, tipo, caminho, nome, tamanho, ordem)
  select p_aula, i ->> 'tipo', i ->> 'caminho', left(trim(i ->> 'nome'), 160), nullif(i ->> 'tamanho', '')::bigint, (ordinality - 1)::integer
  from jsonb_array_elements(coalesce(p_itens, '[]'::jsonb)) with ordinality as e(i, ordinality);
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('materiais', 'materiais', false, 20971520, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "materiais arquivos: admin envia" on storage.objects
  for insert to authenticated with check (bucket_id = 'materiais' and public.eh_admin());
create policy "materiais arquivos: admin altera" on storage.objects
  for update to authenticated using (bucket_id = 'materiais' and public.eh_admin());
create policy "materiais arquivos: admin apaga" on storage.objects
  for delete to authenticated using (bucket_id = 'materiais' and public.eh_admin());
create policy "materiais arquivos: admin lê" on storage.objects
  for select to authenticated using (bucket_id = 'materiais' and public.eh_admin());
create policy "materiais arquivos: capas das lives para quem tem acesso" on storage.objects
  for select to authenticated using (bucket_id = 'materiais' and name like 'capas/%' and public.tem_acesso_ativo());

alter table public.lives
  drop column capa_url,
  add column capa_path text check (capa_path is null or (char_length(capa_path) <= 300 and capa_path like 'capas/%'));

create or replace function public.aulas_previa(p_etapa uuid, p_dia integer)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'titulo', a.titulo, 'profissional', a.profissional, 'duracao_minutos', a.duracao_minutos,
    'dia_liberacao', a.dia_liberacao, 'ordem', a.ordem, 'liberada', p_dia is not null and a.dia_liberacao <= p_dia,
    'concluida', false
  ) order by a.dia_liberacao, a.ordem, a.created_at), '[]'::jsonb)
  from public.aulas a
  where a.etapa_id = p_etapa and a.publicado;
$$;

create or replace function public.trilha_previa(p_dia integer, p_tema uuid default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tema uuid := case when p_dia >= 8 then p_tema end;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if p_dia not between 1 and 365 then
    raise exception 'dia fora de 1 a 365' using errcode = '22023';
  end if;
  return jsonb_build_object(
    'dia', p_dia,
    'tema_atual', v_tema,
    'temas', (
      select coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'chave', t.chave, 'titulo', t.titulo, 'frase', t.descricao) order by t.ordem), '[]'::jsonb)
      from public.temas t where t.tipo = 'tema' and t.publicado
    ),
    'preparacao', (
      select coalesce(jsonb_agg(x.aula order by x.ord), '[]'::jsonb) from (
        select a.value as aula, a.ordinality as ord
        from public.etapas e join public.temas t on t.id = e.tema_id,
          jsonb_array_elements(public.aulas_previa(e.id, p_dia)) with ordinality as a
        where t.tipo = 'preparacao' and t.publicado and e.publicado
      ) x
    ),
    'etapas', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', e.id, 'chave', e.chave, 'titulo', e.titulo, 'ordem', e.ordem,
        'iniciada_em', case when p_dia >= e.inicio then public.hoje_brasilia() - (p_dia - e.inicio) end,
        'dia_na_etapa', case when p_dia >= e.inicio then p_dia - e.inicio + 1 end,
        'aulas', public.aulas_previa(e.id, case when p_dia >= e.inicio then p_dia - e.inicio + 1 end)
      ) order by e.ordem), '[]'::jsonb)
      from (
        select x.*, 8 + 30 * (row_number() over (order by x.ordem) - 1)::integer as inicio
        from public.etapas x where x.tema_id = v_tema and x.publicado
      ) e
      join public.temas t on t.id = e.tema_id and t.publicado
    )
  );
end;
$$;

alter table public.perfis
  add column acesso_liberado_por uuid references public.perfis (id) on delete set null,
  add column acesso_liberado_em timestamptz;

create table public.acessos_liberados (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  inicio timestamptz not null,
  fim timestamptz not null,
  liberado_por uuid references public.perfis (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.acessos_liberados enable row level security;
revoke all on public.acessos_liberados from anon, authenticated;
grant select on public.acessos_liberados to authenticated;
create policy "acessos_liberados: admin lê" on public.acessos_liberados
  for select to authenticated using (public.eh_admin());

create or replace function public.liberar_acesso(p_perfil uuid, p_inicio date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inicio timestamptz := p_inicio::timestamp at time zone 'America/Sao_Paulo';
  v_fim timestamptz := (p_inicio + interval '12 months')::timestamp at time zone 'America/Sao_Paulo';
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if p_inicio is null or p_inicio > public.hoje_brasilia() + 365 or p_inicio < date '2026-01-01' then
    raise exception 'data de início inválida' using errcode = '22023';
  end if;
  update public.perfis
  set acesso_inicio_em = v_inicio, acesso_fim_em = v_fim, acesso_liberado_por = auth.uid(), acesso_liberado_em = now()
  where id = p_perfil;
  if not found then
    raise exception 'pessoa não encontrada' using errcode = 'P0002';
  end if;
  insert into public.acessos_liberados (perfil_id, inicio, fim, liberado_por) values (p_perfil, v_inicio, v_fim, auth.uid());
end;
$$;

revoke all on function public.salvar_materiais(uuid, jsonb), public.aulas_previa(uuid, integer), public.trilha_previa(integer, uuid),
  public.liberar_acesso(uuid, date) from public, anon;
revoke all on function public.aulas_previa(uuid, integer) from authenticated;
grant execute on function public.salvar_materiais(uuid, jsonb), public.trilha_previa(integer, uuid), public.liberar_acesso(uuid, date) to authenticated;
