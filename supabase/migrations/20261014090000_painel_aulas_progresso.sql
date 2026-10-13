alter table public.temas add column cor text check (cor in ('verde', 'coral', 'dourado', 'lilas', 'rosa', 'escuro'));
alter table public.etapas add column cor text check (cor in ('verde', 'coral', 'dourado', 'lilas', 'rosa', 'escuro'));

alter table public.aula_materiais drop constraint aula_materiais_tipo_check;
alter table public.aula_materiais add constraint aula_materiais_tipo_check check (tipo in ('pdf', 'imagem', 'word', 'link'));

update storage.buckets
set allowed_mime_types = array[
  'application/pdf', 'image/jpeg', 'image/png', 'image/webp',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]
where id = 'materiais';

create table public.aulas_progresso (
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  aula_id uuid not null references public.aulas (id) on delete cascade,
  trechos jsonb not null default '[]'::jsonb check (jsonb_typeof(trechos) = 'array' and jsonb_array_length(trechos) <= 500),
  posicao numeric not null default 0 check (posicao >= 0),
  duracao numeric not null default 0 check (duracao >= 0),
  updated_at timestamptz not null default now(),
  primary key (perfil_id, aula_id)
);
create trigger aulas_progresso_updated_at before update on public.aulas_progresso for each row execute function public.tocar_updated_at();
alter table public.aulas_progresso enable row level security;
revoke all on public.aulas_progresso from anon, authenticated;
grant select, insert, update on public.aulas_progresso to authenticated;
create policy "progresso: dona e admin leem" on public.aulas_progresso
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "progresso: dona grava na aula liberada" on public.aulas_progresso
  for insert to authenticated with check (perfil_id = auth.uid() and public.aula_liberada(aula_id));
create policy "progresso: dona atualiza na aula liberada" on public.aulas_progresso
  for update to authenticated using (perfil_id = auth.uid())
  with check (perfil_id = auth.uid() and public.aula_liberada(aula_id));

create or replace function public.trilha_aluna()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tema uuid;
begin
  if not public.tem_acesso_ativo() then
    return jsonb_build_object('dia', null);
  end if;
  perform public.atualizar_etapas(auth.uid());
  select tema_atual_id into v_tema from public.perfis where id = auth.uid();
  return jsonb_build_object(
    'dia', public.dia_de_acesso(),
    'tema_atual', v_tema,
    'temas', (
      select coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'chave', t.chave, 'cor', t.cor, 'titulo', t.titulo, 'frase', t.descricao) order by t.ordem), '[]'::jsonb)
      from public.temas t where t.tipo = 'tema' and t.publicado
    ),
    'preparacao', (
      select coalesce(jsonb_agg(x.aula order by x.ord), '[]'::jsonb) from (
        select a.value as aula, a.ordinality as ord
        from public.etapas e join public.temas t on t.id = e.tema_id,
          jsonb_array_elements(public.aulas_da_etapa(e.id)) with ordinality as a
        where t.tipo = 'preparacao' and t.publicado and e.publicado
      ) x
    ),
    'etapas', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', e.id, 'chave', e.chave, 'titulo', e.titulo, 'ordem', e.ordem,
        'iniciada_em', ei.iniciada_em,
        'dia_na_etapa', case when ei.iniciada_em is null then null else (public.hoje_brasilia() - ei.iniciada_em) + 1 end,
        'aulas', public.aulas_da_etapa(e.id)
      ) order by e.ordem), '[]'::jsonb)
      from public.etapas e
      left join public.etapas_iniciadas ei on ei.etapa_id = e.id and ei.perfil_id = auth.uid()
      where e.tema_id = v_tema and e.publicado
    )
  );
end;
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
      select coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'chave', t.chave, 'cor', t.cor, 'titulo', t.titulo, 'frase', t.descricao) order by t.ordem), '[]'::jsonb)
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
