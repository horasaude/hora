create table public.regras_pontos (
  acao text primary key check (acao in ('treino_foto', 'agua', 'cardio', 'tarefa', 'foto_refeicao', 'aula_concluida', 'duvida_forum', 'duvida_util', 'live', 'indicacao')),
  nome text not null check (char_length(nome) between 1 and 80),
  pontos integer not null check (pontos between 0 and 10000),
  limite_tipo text not null check (limite_tipo in ('por_dia', 'por_referencia', 'sem_limite')),
  limite_qtd integer check (limite_qtd between 1 and 50),
  ativo boolean not null default true,
  ordem integer not null default 0,
  updated_at timestamptz not null default now(),
  check ((limite_tipo = 'por_dia') = (limite_qtd is not null))
);

insert into public.regras_pontos (acao, nome, pontos, limite_tipo, limite_qtd, ordem) values
  ('treino_foto', 'Treino com foto', 10, 'por_dia', 1, 1),
  ('agua', 'Água', 5, 'por_dia', 1, 2),
  ('cardio', 'Cardio', 5, 'por_dia', 1, 3),
  ('tarefa', 'Tarefa do dia', 5, 'por_dia', 1, 4),
  ('foto_refeicao', 'Foto da refeição', 5, 'por_dia', 1, 5),
  ('aula_concluida', 'Concluir aula', 10, 'por_referencia', null, 6),
  ('duvida_forum', 'Enviar dúvida no fórum', 5, 'por_dia', 2, 7),
  ('duvida_util', 'Dúvida marcada como útil', 10, 'sem_limite', null, 8),
  ('live', 'Entrar na live', 75, 'por_referencia', null, 9),
  ('indicacao', 'Indicação confirmada', 150, 'por_referencia', null, 10);

create table public.lancamentos_pontos (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  acao text not null check (acao in ('treino_foto', 'agua', 'cardio', 'tarefa', 'foto_refeicao', 'aula_concluida', 'duvida_forum', 'duvida_util', 'live', 'indicacao', 'desafio_checkin', 'desafio_bonus', 'ajuste', 'estorno')),
  pontos integer not null check (pontos <> 0),
  dia date not null default public.hoje_brasilia(),
  origem text not null check (char_length(origem) between 1 and 40),
  referencia text check (char_length(referencia) <= 200),
  motivo text check (char_length(motivo) <= 300),
  estorna uuid unique references public.lancamentos_pontos (id),
  criado_por uuid references public.perfis (id),
  created_at timestamptz not null default now(),
  check ((acao = 'estorno') = (estorna is not null))
);

create unique index lancamentos_uma_vez_por_referencia on public.lancamentos_pontos (perfil_id, acao, referencia)
  where referencia is not null and acao in ('aula_concluida', 'live', 'indicacao', 'desafio_bonus', 'desafio_checkin', 'treino_foto', 'agua', 'cardio', 'tarefa', 'foto_refeicao');
create index lancamentos_perfil_idx on public.lancamentos_pontos (perfil_id, dia desc);
create index lancamentos_dia_idx on public.lancamentos_pontos (dia desc);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references public.perfis (id) on delete cascade,
  tipo text not null check (tipo in ('treino', 'agua', 'cardio', 'tarefa', 'refeicao')),
  dia date not null default public.hoje_brasilia(),
  foto_path text check (char_length(foto_path) <= 300),
  tipo_treino text check (char_length(tipo_treino) <= 60),
  invalidado_em timestamptz,
  invalidado_por uuid references public.perfis (id),
  motivo_invalidacao text check (char_length(motivo_invalidacao) <= 300),
  foto_apagada_em timestamptz,
  created_at timestamptz not null default now(),
  unique (perfil_id, tipo, dia)
);
create index checkins_foto_idx on public.checkins (created_at) where foto_path is not null;

create table public.denuncias_checkin (
  checkin_id uuid not null references public.checkins (id) on delete cascade,
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (checkin_id, perfil_id)
);

alter table public.perfis
  add column codigo_indicacao text unique default upper(substr(md5(gen_random_uuid()::text), 1, 8)),
  add column cpf text check (cpf ~ '^\d{11}$');
update public.perfis set codigo_indicacao = upper(substr(md5(gen_random_uuid()::text), 1, 8)) where codigo_indicacao is null;
alter table public.perfis alter column codigo_indicacao set not null;

create table public.indicacoes (
  id uuid primary key default gen_random_uuid(),
  indicadora_id uuid not null references public.perfis (id) on delete cascade,
  indicada_id uuid references public.perfis (id) on delete set null,
  indicada_nome text not null default '' check (char_length(indicada_nome) <= 120),
  indicada_email text not null check (char_length(indicada_email) between 3 and 254),
  indicada_cpf text check (indicada_cpf ~ '^\d{11}$'),
  compra_confirmada_em timestamptz not null default now(),
  garantia_ate timestamptz not null default now() + interval '7 days',
  status text not null default 'aguardando' check (status in ('aguardando', 'confirmada', 'cancelada')),
  motivo_cancelamento text check (char_length(motivo_cancelamento) <= 300),
  created_at timestamptz not null default now(),
  unique (indicada_email)
);

alter table public.desafios add column premio_surpresa boolean not null default false;

create trigger regras_pontos_updated_at before update on public.regras_pontos for each row execute function public.tocar_updated_at();

alter table public.regras_pontos enable row level security;
alter table public.lancamentos_pontos enable row level security;
alter table public.checkins enable row level security;
alter table public.denuncias_checkin enable row level security;
alter table public.indicacoes enable row level security;

revoke all on public.regras_pontos, public.lancamentos_pontos, public.checkins, public.denuncias_checkin, public.indicacoes from anon, authenticated;
grant select on public.regras_pontos, public.lancamentos_pontos, public.checkins, public.denuncias_checkin, public.indicacoes to authenticated;
grant update (pontos, limite_tipo, limite_qtd, ativo) on public.regras_pontos to authenticated;
grant insert on public.denuncias_checkin to authenticated;

create policy "regras: todos com acesso leem" on public.regras_pontos
  for select to authenticated using (public.eh_admin() or public.tem_acesso_ativo());
create policy "regras: admin edita" on public.regras_pontos
  for update to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "lancamentos: dona e admin leem" on public.lancamentos_pontos
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "checkins: dona e admin leem" on public.checkins
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "denuncias: admin lê" on public.denuncias_checkin
  for select to authenticated using (public.eh_admin() or perfil_id = auth.uid());
create policy "denuncias: aluna com acesso denuncia" on public.denuncias_checkin
  for insert to authenticated with check (perfil_id = auth.uid() and public.tem_acesso_ativo());
create policy "indicacoes: indicadora e admin leem" on public.indicacoes
  for select to authenticated using (indicadora_id = auth.uid() or public.eh_admin());

create or replace function public.conceder_pontos(
  p_perfil uuid, p_acao text, p_origem text, p_referencia text default null, p_pontos integer default null, p_motivo text default null, p_criado_por uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_regra public.regras_pontos;
  v_pontos integer := p_pontos;
  v_hoje date := public.hoje_brasilia();
  v_id uuid;
begin
  perform pg_advisory_xact_lock(hashtext(p_perfil::text || p_acao));
  select * into v_regra from public.regras_pontos where acao = p_acao;
  if found then
    if not v_regra.ativo or v_regra.pontos = 0 then
      return null;
    end if;
    v_pontos := v_regra.pontos;
    if v_regra.limite_tipo = 'por_dia' and (
      select count(*) from public.lancamentos_pontos l
      where l.perfil_id = p_perfil and l.acao = p_acao and l.dia = v_hoje and l.pontos > 0
    ) >= v_regra.limite_qtd then
      return null;
    end if;
  end if;
  if v_pontos is null or v_pontos = 0 then
    return null;
  end if;
  insert into public.lancamentos_pontos (perfil_id, acao, pontos, dia, origem, referencia, motivo, criado_por)
  values (p_perfil, p_acao, v_pontos, v_hoje, p_origem, p_referencia, p_motivo, p_criado_por)
  on conflict do nothing
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.estornar_lancamento(p_lancamento uuid, p_motivo text, p_criado_por uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.lancamentos_pontos (perfil_id, acao, pontos, origem, referencia, motivo, estorna, criado_por)
  select l.perfil_id, 'estorno', -l.pontos, 'estorno', l.referencia, p_motivo, l.id, p_criado_por
  from public.lancamentos_pontos l
  where l.id = p_lancamento and l.acao <> 'estorno'
  on conflict do nothing
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.fazer_checkin(p_tipo text, p_foto_path text default null, p_tipo_treino text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_acao text;
begin
  if not public.tem_acesso_ativo() then
    raise exception 'sem acesso' using errcode = '42501';
  end if;
  if p_foto_path is not null and split_part(p_foto_path, '/', 1) <> auth.uid()::text then
    raise exception 'foto de outra pessoa' using errcode = '42501';
  end if;
  insert into public.checkins (perfil_id, tipo, foto_path, tipo_treino)
  values (auth.uid(), p_tipo, p_foto_path, left(p_tipo_treino, 60))
  returning id into v_id;
  v_acao := case p_tipo
    when 'treino' then case when p_foto_path is not null then 'treino_foto' end
    when 'refeicao' then case when p_foto_path is not null then 'foto_refeicao' end
    else p_tipo end;
  if v_acao is not null then
    perform public.conceder_pontos(auth.uid(), v_acao, 'checkin', v_id::text);
  end if;
  return v_id;
end;
$$;

create or replace function public.invalidar_checkin(p_checkin uuid, p_motivo text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lanc record;
  v_total integer := 0;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  update public.checkins set invalidado_em = now(), invalidado_por = auth.uid(), motivo_invalidacao = p_motivo
  where id = p_checkin and invalidado_em is null;
  if not found then
    return 0;
  end if;
  for v_lanc in
    select id from public.lancamentos_pontos where referencia = p_checkin::text and acao <> 'estorno' and pontos > 0
  loop
    if public.estornar_lancamento(v_lanc.id, p_motivo, auth.uid()) is not null then
      v_total := v_total + 1;
    end if;
  end loop;
  return v_total;
end;
$$;

create or replace function public.lancar_ajuste(p_perfil uuid, p_pontos integer, p_motivo text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if p_pontos = 0 or abs(p_pontos) > 10000 or char_length(trim(coalesce(p_motivo, ''))) = 0 then
    raise exception 'ajuste inválido' using errcode = '22023';
  end if;
  return public.conceder_pontos(p_perfil, 'ajuste', 'painel', null, p_pontos, trim(p_motivo), auth.uid());
end;
$$;

create or replace function public.registrar_indicacao(p_codigo text, p_nome text, p_email text, p_cpf text, p_indicada uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_indicadora public.perfis;
  v_email text;
  v_id uuid;
begin
  select * into v_indicadora from public.perfis where codigo_indicacao = upper(trim(p_codigo));
  if not found then
    return null;
  end if;
  select email into v_email from auth.users where id = v_indicadora.id;
  if lower(trim(p_email)) = lower(coalesce(v_email, '')) or (p_cpf is not null and p_cpf = v_indicadora.cpf) or p_indicada = v_indicadora.id then
    return null;
  end if;
  insert into public.indicacoes (indicadora_id, indicada_id, indicada_nome, indicada_email, indicada_cpf)
  values (v_indicadora.id, p_indicada, left(coalesce(p_nome, ''), 120), lower(trim(p_email)), p_cpf)
  on conflict (indicada_email) do nothing
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.cancelar_indicacao(p_indicacao uuid, p_motivo text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.indicacoes set status = 'cancelada', motivo_cancelamento = p_motivo
  where id = p_indicacao and status = 'aguardando';
end;
$$;

create or replace function public.confirmar_indicacoes()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ind record;
  v_total integer := 0;
begin
  for v_ind in
    update public.indicacoes set status = 'confirmada'
    where status = 'aguardando' and garantia_ate <= now()
    returning id, indicadora_id
  loop
    perform public.conceder_pontos(v_ind.indicadora_id, 'indicacao', 'indicacao', v_ind.id::text);
    v_total := v_total + 1;
  end loop;
  return v_total;
end;
$$;

create or replace function public.pontos_ao_concluir_aula()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.conceder_pontos(new.perfil_id, 'aula_concluida', 'aula', new.aula_id::text);
  return new;
end;
$$;

create trigger aulas_concluidas_pontos after insert on public.aulas_concluidas
  for each row execute function public.pontos_ao_concluir_aula();

create or replace function public.pontos_do_desafio()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_d public.desafios;
begin
  select * into v_d from public.desafios where id = new.desafio_id;
  if v_d.tipo_checkin = 'numero' and coalesce(new.valor, 0) < v_d.meta_diaria then
    return new;
  end if;
  perform public.conceder_pontos(new.perfil_id, 'desafio_checkin', 'desafio', new.desafio_id::text || ':' || new.dia::text, v_d.pontos_por_dia, v_d.nome);
  if public.dias_cumpridos(v_d.id, new.perfil_id) >= v_d.meta_dias then
    perform public.conceder_pontos(new.perfil_id, 'desafio_bonus', 'desafio', v_d.id::text, v_d.bonus_conclusao, v_d.nome);
  end if;
  return new;
end;
$$;

create trigger desafio_checkins_pontos after insert on public.desafio_checkins
  for each row execute function public.pontos_do_desafio();

create or replace function public.participantes_desafio(p_desafio uuid)
returns table (perfil_id uuid, nome text, apelido text, dias integer, meta integer)
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
  select pf.id, pf.nome, pf.apelido, public.dias_cumpridos(d.id, pf.id), d.meta_dias
  from public.desafios d
  join public.perfis pf on pf.id in (
    select p.perfil_id from public.desafio_participantes p where p.desafio_id = d.id
    union
    select c.perfil_id from public.desafio_checkins c where c.desafio_id = d.id
  )
  where d.id = p_desafio
  order by 4 desc, pf.nome;
end;
$$;

create or replace function public.painel_pontos()
returns table (pontos_mes integer, checkins_hoje integer, indicacoes_mes integer, fotos_denunciadas integer)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_inicio date := date_trunc('month', public.hoje_brasilia())::date;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  return query select
    (select coalesce(sum(l.pontos), 0)::integer from public.lancamentos_pontos l where l.dia >= v_inicio),
    (select count(*)::integer from public.checkins c where c.dia = public.hoje_brasilia() and c.invalidado_em is null),
    (select count(*)::integer from public.indicacoes i where i.status = 'confirmada' and i.garantia_ate >= v_inicio),
    (select count(distinct d.checkin_id)::integer from public.denuncias_checkin d join public.checkins c on c.id = d.checkin_id where c.invalidado_em is null and c.foto_path is not null);
end;
$$;

create or replace function public.marcar_fotos_apagadas(p_ids uuid[])
returns void
language sql
security definer
set search_path = public
as $$
  update public.checkins set foto_path = null, foto_apagada_em = now() where id = any(p_ids);
$$;

revoke all on function public.conceder_pontos(uuid, text, text, text, integer, text, uuid), public.estornar_lancamento(uuid, text, uuid),
  public.registrar_indicacao(text, text, text, text, uuid), public.cancelar_indicacao(uuid, text), public.confirmar_indicacoes(),
  public.pontos_ao_concluir_aula(), public.pontos_do_desafio(), public.marcar_fotos_apagadas(uuid[]) from public, anon, authenticated;
grant execute on function public.registrar_indicacao(text, text, text, text, uuid), public.cancelar_indicacao(uuid, text),
  public.confirmar_indicacoes(), public.marcar_fotos_apagadas(uuid[]) to service_role;
revoke all on function public.fazer_checkin(text, text, text), public.invalidar_checkin(uuid, text), public.lancar_ajuste(uuid, integer, text),
  public.participantes_desafio(uuid), public.painel_pontos() from public, anon;
grant execute on function public.fazer_checkin(text, text, text), public.invalidar_checkin(uuid, text), public.lancar_ajuste(uuid, integer, text),
  public.participantes_desafio(uuid), public.painel_pontos() to authenticated;

insert into storage.buckets (id, name, public) values ('checkins', 'checkins', false) on conflict (id) do nothing;

create policy "checkins fotos: aluna envia na pasta dela" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'checkins' and split_part(name, '/', 1) = auth.uid()::text and public.tem_acesso_ativo());
create policy "checkins fotos: dona e admin veem" on storage.objects
  for select to authenticated
  using (bucket_id = 'checkins' and (split_part(name, '/', 1) = auth.uid()::text or public.eh_admin()));

do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron;
    perform cron.schedule('confirmar-indicacoes', '15 3 * * *', 'select public.confirmar_indicacoes()');
  end if;
end;
$$;

do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron')
    and exists (select 1 from pg_available_extensions where name = 'pg_net') then
    create extension if not exists pg_net;
    perform cron.schedule(
      'limpar-fotos-checkin',
      '30 3 * * *',
      $cron$
        select net.http_post(
          url := 'https://zijtjwhvnhfarmfscmnr.supabase.co/functions/v1/limpar-fotos',
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
