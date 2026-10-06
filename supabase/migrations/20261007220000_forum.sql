alter table public.perfis
  add column especialidade text check (especialidade in ('alimentacao', 'treino', 'saude')),
  add column titulo_profissional text check (char_length(titulo_profissional) <= 80),
  add column foto_path text check (char_length(foto_path) <= 200),
  add column forum_regras_em timestamptz;

create table public.forum_topicos (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  aula_id uuid references public.aulas (id) on delete set null,
  categoria text not null check (categoria in ('alimentacao', 'treino', 'saude', 'plataforma', 'outros')),
  texto text not null check (char_length(btrim(texto)) between 3 and 2000),
  prazo_em timestamptz not null default now() + interval '72 hours',
  respondida_em timestamptz,
  respondida_por uuid references public.perfis (id) on delete set null,
  ultima_resposta_equipe_em timestamptz,
  resposta_vista_em timestamptz,
  util_em timestamptz,
  util_por uuid references public.perfis (id) on delete set null,
  oculto_em timestamptz,
  oculto_por uuid references public.perfis (id) on delete set null,
  motivo_ocultar text check (char_length(motivo_ocultar) <= 300),
  created_at timestamptz not null default now()
);
create index forum_topicos_aula_idx on public.forum_topicos (aula_id, created_at desc);
create index forum_topicos_perfil_idx on public.forum_topicos (perfil_id, created_at desc);
create index forum_topicos_fila_idx on public.forum_topicos (prazo_em) where respondida_em is null and oculto_em is null;

create table public.forum_respostas (
  id uuid primary key default gen_random_uuid(),
  topico_id uuid not null references public.forum_topicos (id) on delete cascade,
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  texto text not null check (char_length(btrim(texto)) between 1 and 2000),
  da_equipe boolean not null default false,
  oculto_em timestamptz,
  oculto_por uuid references public.perfis (id) on delete set null,
  motivo_ocultar text check (char_length(motivo_ocultar) <= 300),
  created_at timestamptz not null default now()
);
create index forum_respostas_topico_idx on public.forum_respostas (topico_id, created_at);

create table public.forum_curtidas (
  resposta_id uuid not null references public.forum_respostas (id) on delete cascade,
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (resposta_id, perfil_id)
);

create table public.forum_denuncias (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  topico_id uuid references public.forum_topicos (id) on delete cascade,
  resposta_id uuid references public.forum_respostas (id) on delete cascade,
  motivo text check (char_length(motivo) <= 300),
  resolvida_em timestamptz,
  resolucao text check (resolucao in ('mantido', 'ocultado')),
  created_at timestamptz not null default now(),
  check ((topico_id is null) <> (resposta_id is null))
);
create unique index forum_denuncias_topico_uniq on public.forum_denuncias (perfil_id, topico_id) where topico_id is not null;
create unique index forum_denuncias_resposta_uniq on public.forum_denuncias (perfil_id, resposta_id) where resposta_id is not null;

alter table public.forum_topicos enable row level security;
alter table public.forum_respostas enable row level security;
alter table public.forum_curtidas enable row level security;
alter table public.forum_denuncias enable row level security;

revoke all on public.forum_topicos, public.forum_respostas, public.forum_curtidas, public.forum_denuncias from anon, authenticated;
grant select on public.forum_topicos, public.forum_respostas, public.forum_curtidas, public.forum_denuncias to authenticated;

create policy "forum topicos: autora e admin leem" on public.forum_topicos
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "forum respostas: autora e admin leem" on public.forum_respostas
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "forum curtidas: dona e admin leem" on public.forum_curtidas
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "forum denuncias: admin lê" on public.forum_denuncias
  for select to authenticated using (public.eh_admin());

create or replace function public.forum_exigir_acesso()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_admin boolean := public.eh_admin();
begin
  if not v_admin and not public.tem_acesso_ativo() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  return v_admin;
end;
$$;

create or replace function public.forum_listar(
  p_id uuid default null,
  p_aula uuid default null,
  p_categoria text default null,
  p_busca text default null,
  p_minhas boolean default false,
  p_limite integer default 50
)
returns table (
  id uuid, autora text, categoria text, texto text, aula_id uuid, aula_titulo text, created_at timestamptz,
  prazo_em timestamptz, respondida_em timestamptz, util boolean, minha boolean, oculto boolean,
  total_respostas integer, respostas jsonb
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_admin boolean := public.forum_exigir_acesso();
  v_eu uuid := auth.uid();
  v_busca text := nullif(lower(btrim(coalesce(p_busca, ''))), '');
begin
  return query
  select t.id, coalesce(nullif(btrim(p.apelido), ''), 'Aluna'), t.categoria, t.texto, t.aula_id, a.titulo, t.created_at,
    t.prazo_em, t.respondida_em, t.util_em is not null, t.perfil_id = v_eu, t.oculto_em is not null,
    (select count(*)::integer from public.forum_respostas r where r.topico_id = t.id and r.oculto_em is null),
    case when p_id is null and p_aula is null then '[]'::jsonb else (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', r.id, 'texto', r.texto, 'created_at', r.created_at, 'da_equipe', r.da_equipe,
        'autora', case when r.da_equipe then rp.nome else coalesce(nullif(btrim(rp.apelido), ''), 'Aluna') end,
        'titulo', case when r.da_equipe then rp.titulo_profissional end,
        'foto', case when r.da_equipe then rp.foto_path end,
        'curtidas', (select count(*) from public.forum_curtidas c where c.resposta_id = r.id),
        'curti', exists (select 1 from public.forum_curtidas c where c.resposta_id = r.id and c.perfil_id = v_eu),
        'minha', r.perfil_id = v_eu,
        'oculto', r.oculto_em is not null
      ) order by r.da_equipe desc, r.created_at), '[]'::jsonb)
      from public.forum_respostas r
      join public.perfis rp on rp.id = r.perfil_id
      where r.topico_id = t.id and (r.oculto_em is null or v_admin)
    ) end
  from public.forum_topicos t
  join public.perfis p on p.id = t.perfil_id
  left join public.aulas a on a.id = t.aula_id
  where (t.oculto_em is null or v_admin)
    and (p_id is null or t.id = p_id)
    and (p_aula is null or t.aula_id = p_aula)
    and (p_categoria is null or t.categoria = p_categoria)
    and (v_busca is null or position(v_busca in lower(t.texto)) > 0)
    and (not p_minhas or t.perfil_id = v_eu)
  order by t.created_at desc
  limit least(greatest(coalesce(p_limite, 50), 1), 200);
end;
$$;

create or replace function public.forum_perguntar(p_texto text, p_categoria text, p_aula uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if not public.tem_acesso_ativo() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if p_aula is not null and not exists (select 1 from public.aulas where id = p_aula and publicado) then
    raise exception 'aula não encontrada' using errcode = '22023';
  end if;
  if (select count(*) from public.forum_topicos where perfil_id = auth.uid() and created_at > now() - interval '1 day') >= 10 then
    raise exception 'limite de dúvidas do dia' using errcode = '54000';
  end if;
  insert into public.forum_topicos (perfil_id, aula_id, categoria, texto)
  values (auth.uid(), p_aula, p_categoria, btrim(p_texto))
  returning id into v_id;
  perform public.conceder_pontos(auth.uid(), 'duvida_forum', 'forum', v_id::text);
  return v_id;
end;
$$;

create or replace function public.forum_responder(p_topico uuid, p_texto text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin boolean := public.forum_exigir_acesso();
  v_id uuid;
begin
  perform 1 from public.forum_topicos where id = p_topico and oculto_em is null for update;
  if not found then
    raise exception 'dúvida não encontrada' using errcode = '22023';
  end if;
  insert into public.forum_respostas (topico_id, perfil_id, texto, da_equipe)
  values (p_topico, auth.uid(), btrim(p_texto), v_admin)
  returning id into v_id;
  if v_admin then
    update public.forum_topicos
    set respondida_em = coalesce(respondida_em, now()),
      respondida_por = coalesce(respondida_por, auth.uid()),
      ultima_resposta_equipe_em = now()
    where id = p_topico;
  end if;
  return v_id;
end;
$$;

create or replace function public.forum_curtir(p_resposta uuid, p_curtir boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.forum_exigir_acesso();
  if not exists (select 1 from public.forum_respostas where id = p_resposta and oculto_em is null) then
    raise exception 'resposta não encontrada' using errcode = '22023';
  end if;
  if p_curtir then
    insert into public.forum_curtidas (resposta_id, perfil_id) values (p_resposta, auth.uid()) on conflict do nothing;
  else
    delete from public.forum_curtidas where resposta_id = p_resposta and perfil_id = auth.uid();
  end if;
end;
$$;

create or replace function public.forum_denunciar(p_topico uuid, p_resposta uuid, p_motivo text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.forum_exigir_acesso();
  if (p_topico is null) = (p_resposta is null) then
    raise exception 'escolha um post' using errcode = '22023';
  end if;
  if p_topico is not null and not exists (
    select 1 from public.forum_topicos where id = p_topico and oculto_em is null and perfil_id <> auth.uid()
  ) or p_resposta is not null and not exists (
    select 1 from public.forum_respostas where id = p_resposta and oculto_em is null and perfil_id <> auth.uid()
  ) then
    raise exception 'post não encontrado' using errcode = '22023';
  end if;
  insert into public.forum_denuncias (perfil_id, topico_id, resposta_id, motivo)
  values (auth.uid(), p_topico, p_resposta, nullif(btrim(coalesce(p_motivo, '')), ''))
  on conflict do nothing;
end;
$$;

create or replace function public.forum_aceitar_regras()
returns void
language sql
security definer
set search_path = public
as $$
  update public.perfis set forum_regras_em = coalesce(forum_regras_em, now()) where id = auth.uid();
$$;

create or replace function public.forum_marcar_vista(p_topico uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.forum_topicos set resposta_vista_em = now()
  where id = p_topico and perfil_id = auth.uid() and ultima_resposta_equipe_em is not null;
$$;

create or replace function public.forum_minhas_respondidas()
returns table (id uuid, texto text, respondida_em timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select t.id, t.texto, t.ultima_resposta_equipe_em
  from public.forum_topicos t
  where t.perfil_id = auth.uid() and t.oculto_em is null and t.ultima_resposta_equipe_em is not null
    and (t.resposta_vista_em is null or t.resposta_vista_em < t.ultima_resposta_equipe_em)
  order by t.ultima_resposta_equipe_em desc
  limit 5;
$$;

create or replace function public.forum_marcar_util(p_topico uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_autora uuid;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  update public.forum_topicos set util_em = now(), util_por = auth.uid()
  where id = p_topico and util_em is null and oculto_em is null
  returning perfil_id into v_autora;
  if v_autora is null then
    return false;
  end if;
  perform public.conceder_pontos(v_autora, 'duvida_util', 'forum', p_topico::text, null, null, auth.uid());
  return true;
end;
$$;

create or replace function public.forum_ocultar(p_topico uuid, p_resposta uuid, p_motivo text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_motivo text := btrim(coalesce(p_motivo, ''));
  v_lanc uuid;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if char_length(v_motivo) not between 1 and 300 or (p_topico is null) = (p_resposta is null) then
    raise exception 'motivo obrigatório' using errcode = '22023';
  end if;
  if p_topico is not null then
    update public.forum_topicos set oculto_em = now(), oculto_por = auth.uid(), motivo_ocultar = v_motivo
    where id = p_topico and oculto_em is null;
    for v_lanc in
      select l.id from public.lancamentos_pontos l
      where l.referencia = p_topico::text and l.acao in ('duvida_forum', 'duvida_util') and l.pontos > 0
    loop
      perform public.estornar_lancamento(v_lanc, 'Dúvida oculta: ' || v_motivo, auth.uid());
    end loop;
    update public.forum_denuncias set resolvida_em = now(), resolucao = 'ocultado'
    where topico_id = p_topico and resolvida_em is null;
  else
    update public.forum_respostas set oculto_em = now(), oculto_por = auth.uid(), motivo_ocultar = v_motivo
    where id = p_resposta and oculto_em is null;
    update public.forum_denuncias set resolvida_em = now(), resolucao = 'ocultado'
    where resposta_id = p_resposta and resolvida_em is null;
  end if;
end;
$$;

create or replace function public.forum_manter(p_topico uuid, p_resposta uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  update public.forum_denuncias set resolvida_em = now(), resolucao = 'mantido'
  where resolvida_em is null
    and (topico_id = p_topico and p_resposta is null or resposta_id = p_resposta and p_topico is null);
end;
$$;

create or replace function public.painel_forum()
returns table (abertas integer, perto integer, vencidas integer, respondidas_semana integer)
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  return query
  select
    count(*) filter (where t.respondida_em is null and t.oculto_em is null)::integer,
    count(*) filter (where t.respondida_em is null and t.oculto_em is null and t.prazo_em >= now() and t.prazo_em < now() + interval '12 hours')::integer,
    count(*) filter (where t.respondida_em is null and t.oculto_em is null and t.prazo_em < now())::integer,
    count(*) filter (where t.respondida_em >= now() - interval '7 days')::integer
  from public.forum_topicos t;
end;
$$;

create or replace function public.painel_denuncias_forum()
returns table (topico_id uuid, resposta_id uuid, texto text, autora text, total integer, ultima timestamptz, motivos text[])
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  return query
  select coalesce(d.topico_id, r.topico_id), d.resposta_id, coalesce(t.texto, r.texto),
    coalesce(nullif(btrim(p.apelido), ''), p.nome), count(*)::integer, max(d.created_at),
    coalesce(array_agg(distinct d.motivo) filter (where d.motivo is not null), '{}')
  from public.forum_denuncias d
  left join public.forum_topicos t on t.id = d.topico_id
  left join public.forum_respostas r on r.id = d.resposta_id
  join public.perfis p on p.id = coalesce(t.perfil_id, r.perfil_id)
  where d.resolvida_em is null
  group by coalesce(d.topico_id, r.topico_id), d.resposta_id, coalesce(t.texto, r.texto), coalesce(nullif(btrim(p.apelido), ''), p.nome)
  order by max(d.created_at) desc;
end;
$$;

create or replace function public.salvar_perfil_equipe(p_nome text, p_especialidade text, p_titulo text, p_foto_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if char_length(btrim(coalesce(p_nome, ''))) not between 1 and 120 then
    raise exception 'nome obrigatório' using errcode = '22023';
  end if;
  update public.perfis
  set nome = btrim(p_nome), especialidade = p_especialidade,
    titulo_profissional = nullif(btrim(coalesce(p_titulo, '')), ''), foto_path = p_foto_path, updated_at = now()
  where id = auth.uid();
end;
$$;

revoke all on function public.forum_exigir_acesso(), public.forum_listar(uuid, uuid, text, text, boolean, integer),
  public.forum_perguntar(text, text, uuid), public.forum_responder(uuid, text), public.forum_curtir(uuid, boolean),
  public.forum_denunciar(uuid, uuid, text), public.forum_aceitar_regras(), public.forum_marcar_vista(uuid),
  public.forum_minhas_respondidas(), public.forum_marcar_util(uuid), public.forum_ocultar(uuid, uuid, text),
  public.forum_manter(uuid, uuid), public.painel_forum(), public.painel_denuncias_forum(),
  public.salvar_perfil_equipe(text, text, text, text) from public, anon;
grant execute on function public.forum_exigir_acesso(), public.forum_listar(uuid, uuid, text, text, boolean, integer),
  public.forum_perguntar(text, text, uuid), public.forum_responder(uuid, text), public.forum_curtir(uuid, boolean),
  public.forum_denunciar(uuid, uuid, text), public.forum_aceitar_regras(), public.forum_marcar_vista(uuid),
  public.forum_minhas_respondidas(), public.forum_marcar_util(uuid), public.forum_ocultar(uuid, uuid, text),
  public.forum_manter(uuid, uuid), public.painel_forum(), public.painel_denuncias_forum(),
  public.salvar_perfil_equipe(text, text, text, text) to authenticated;

insert into storage.buckets (id, name, public) values ('equipe', 'equipe', true) on conflict (id) do nothing;

create policy "equipe fotos: admin envia na pasta dela" on storage.objects
  for insert to authenticated with check (bucket_id = 'equipe' and public.eh_admin() and split_part(name, '/', 1) = auth.uid()::text);
create policy "equipe fotos: admin troca a dela" on storage.objects
  for update to authenticated using (bucket_id = 'equipe' and public.eh_admin() and split_part(name, '/', 1) = auth.uid()::text);
create policy "equipe fotos: admin apaga a dela" on storage.objects
  for delete to authenticated using (bucket_id = 'equipe' and public.eh_admin() and split_part(name, '/', 1) = auth.uid()::text);
