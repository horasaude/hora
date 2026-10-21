create or replace function public.pendencias_de(p_perfil uuid)
returns table (item text, nome text, para text, feito boolean, andamento boolean)
language sql
stable
security definer
set search_path = public
as $$
  with p as (
    select pf.*, public.dia_atual_de(pf.acesso_inicio_em, now()) as dia
    from public.perfis pf where pf.id = p_perfil and pf.papel = 'aluna'
  ),
  feitos as (select f.item from public.comece_aqui_feitos f where f.perfil_id = p_perfil)
  select 'anamnese:' || a.id, 'Responder a ' || lower(left(a.titulo, 1)) || substr(a.titulo, 2),
    '/app/avaliacoes/' || a.id, r.enviada_em is not null, r.perfil_id is not null and r.enviada_em is null
  from p, public.anamneses a
  left join public.anamnese_respostas r on r.anamnese_id = a.id and r.perfil_id = p_perfil
  where a.publicada
  union all
  select x.item, x.nome, '/app', x.feito, false
  from p, (values
    ('comece_perfil', 'Completar o perfil', exists (select 1 from feitos where item = 'perfil'), 1),
    ('comece_medidas', 'Registrar as medidas', exists (select 1 from public.medidas m where m.perfil_id = p_perfil), 2),
    ('comece_foto', 'Mandar a foto de antes', exists (select 1 from public.medidas m where m.perfil_id = p_perfil and m.foto_path is not null), 3),
    ('comece_regras', 'Ler as regras de pontos', exists (select 1 from feitos where item = 'regras'), 4),
    ('comece_app', 'Instalar o app no celular', exists (select 1 from feitos where item = 'app'), 5)
  ) as x(item, nome, feito, ordem)
  union all
  select 'tema', 'Escolher o tema', '/app/trilha', p.tema_atual_id is not null, false
  from p where coalesce(p.dia, 0) >= 8
  union all
  select 'treino', 'Escolher nível e local do treino', '/app/treinos', p.treino_nivel is not null and p.treino_local is not null, false
  from p;
$$;
revoke all on function public.pendencias_de(uuid) from public, anon, authenticated;

create table public.lembretes_aluna (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  item text not null check (char_length(item) between 1 and 60),
  criado_por uuid references public.perfis (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index lembretes_aluna_perfil_idx on public.lembretes_aluna (perfil_id, item, created_at desc);
alter table public.lembretes_aluna enable row level security;
revoke all on public.lembretes_aluna from anon, authenticated;
grant select on public.lembretes_aluna to authenticated;
create policy "lembretes: admin e a dona leem" on public.lembretes_aluna
  for select to authenticated using (public.eh_admin() or perfil_id = auth.uid());

create or replace function public.pendencias_aluna(p_perfil uuid)
returns table (item text, nome text, feito boolean, andamento boolean, lembrada_em timestamptz)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  return query
  select d.item, d.nome, d.feito, d.andamento,
    (select max(l.created_at) from public.lembretes_aluna l where l.perfil_id = p_perfil and l.item = d.item)
  from public.pendencias_de(p_perfil) d;
end;
$$;
revoke all on function public.pendencias_aluna(uuid) from public, anon;
grant execute on function public.pendencias_aluna(uuid) to authenticated;

create or replace function public.lembrar_aluna(p_perfil uuid, p_item text)
returns table (nome text, para text, novo boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nome text;
  v_para text;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  select d.nome, d.para into v_nome, v_para from public.pendencias_de(p_perfil) d
  where d.item = p_item and not d.feito;
  if v_nome is null then
    raise exception 'nada a lembrar' using errcode = '22023';
  end if;
  if exists (
    select 1 from public.lembretes_aluna l
    where l.perfil_id = p_perfil and l.item = p_item and l.created_at > now() - interval '12 hours'
  ) then
    return query select v_nome, v_para, false;
    return;
  end if;
  insert into public.lembretes_aluna (perfil_id, item) values (p_perfil, p_item);
  return query select v_nome, v_para, true;
end;
$$;
revoke all on function public.lembrar_aluna(uuid, text) from public, anon;
grant execute on function public.lembrar_aluna(uuid, text) to authenticated;

create or replace function public.meus_lembretes()
returns table (item text, nome text, para text, lembrada_em timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select d.item, d.nome, d.para, max(l.created_at)
  from public.pendencias_de(auth.uid()) d
  join public.lembretes_aluna l on l.perfil_id = auth.uid() and l.item = d.item
  where not d.feito
  group by d.item, d.nome, d.para
  order by max(l.created_at) desc;
$$;
revoke all on function public.meus_lembretes() from public, anon;
grant execute on function public.meus_lembretes() to authenticated;
