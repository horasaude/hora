create type public.tipo_checkin as enum ('sim_nao', 'foto', 'numero');
create type public.publico_desafio as enum ('todas', 'inscritas');

alter table public.perfis add column ultimo_acesso_em timestamptz;

create table public.cardapios (
  id uuid primary key default gen_random_uuid(),
  objetivo text not null check (char_length(objetivo) between 1 and 80),
  titulo text not null check (char_length(titulo) between 1 and 120),
  descricao text not null default '' check (char_length(descricao) <= 2000),
  cafe text not null default '' check (char_length(cafe) <= 2000),
  lanche_manha text not null default '' check (char_length(lanche_manha) <= 2000),
  almoco text not null default '' check (char_length(almoco) <= 2000),
  lanche_tarde text not null default '' check (char_length(lanche_tarde) <= 2000),
  jantar text not null default '' check (char_length(jantar) <= 2000),
  ceia text not null default '' check (char_length(ceia) <= 2000),
  lista_compras text not null default '' check (char_length(lista_compras) <= 5000),
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.desafios (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 120),
  descricao text not null default '' check (char_length(descricao) <= 2000),
  inicio date not null,
  fim date not null,
  tipo_checkin public.tipo_checkin not null,
  unidade text check (char_length(unidade) between 1 and 40),
  meta_diaria integer check (meta_diaria >= 1),
  meta_dias integer not null check (meta_dias >= 1),
  pontos_por_dia integer not null default 0 check (pontos_por_dia between 0 and 10000),
  bonus_conclusao integer not null default 0 check (bonus_conclusao between 0 and 100000),
  premio text not null default '' check (char_length(premio) <= 500),
  publico public.publico_desafio not null default 'todas',
  publicado boolean not null default false,
  encerrado_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (fim >= inicio),
  check (meta_dias <= fim - inicio + 1),
  check (tipo_checkin <> 'numero' or (meta_diaria is not null and unidade is not null))
);

create table public.desafio_participantes (
  desafio_id uuid not null references public.desafios (id) on delete cascade,
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  entrou_em timestamptz not null default now(),
  primary key (desafio_id, perfil_id)
);

create table public.desafio_checkins (
  desafio_id uuid not null references public.desafios (id) on delete cascade,
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  dia date not null default public.hoje_brasilia(),
  valor integer check (valor >= 0),
  foto_path text check (char_length(foto_path) <= 300),
  created_at timestamptz not null default now(),
  primary key (desafio_id, perfil_id, dia)
);

create table public.configuracoes (
  id boolean primary key default true check (id),
  pix_cheio integer not null check (pix_cheio > 0),
  parcelado_cheio integer not null check (parcelado_cheio > 0),
  recorrente_cheio integer not null check (recorrente_cheio > 0),
  pix_oferta integer not null check (pix_oferta > 0),
  parcelado_oferta integer not null check (parcelado_oferta > 0),
  recorrente_oferta integer not null check (recorrente_oferta > 0),
  oferta_inicio timestamptz not null,
  oferta_fim timestamptz not null,
  termos jsonb not null check (jsonb_typeof(termos) = 'array'),
  privacidade jsonb not null check (jsonb_typeof(privacidade) = 'array'),
  termos_atualizado_em timestamptz not null default now(),
  privacidade_atualizado_em timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (oferta_fim > oferta_inicio)
);

create or replace function public.datar_documentos()
returns trigger
language plpgsql
as $$
begin
  if new.termos is distinct from old.termos then new.termos_atualizado_em = now(); end if;
  if new.privacidade is distinct from old.privacidade then new.privacidade_atualizado_em = now(); end if;
  return new;
end;
$$;

create trigger cardapios_updated_at before update on public.cardapios for each row execute function public.tocar_updated_at();
create trigger desafios_updated_at before update on public.desafios for each row execute function public.tocar_updated_at();
create trigger configuracoes_updated_at before update on public.configuracoes for each row execute function public.tocar_updated_at();
create trigger configuracoes_documentos before update on public.configuracoes for each row execute function public.datar_documentos();

create index desafio_checkins_perfil_idx on public.desafio_checkins (perfil_id);

alter table public.cardapios enable row level security;
alter table public.desafios enable row level security;
alter table public.desafio_participantes enable row level security;
alter table public.desafio_checkins enable row level security;
alter table public.configuracoes enable row level security;

revoke all on public.cardapios, public.desafios, public.desafio_participantes, public.desafio_checkins, public.configuracoes from anon, authenticated;
grant select, insert, update, delete on public.cardapios, public.desafios to authenticated;
grant select, insert on public.desafio_participantes, public.desafio_checkins to authenticated;
grant select on public.configuracoes to anon, authenticated;
grant update on public.configuracoes to authenticated;

create policy "cardapios: admin gerencia" on public.cardapios
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "cardapios: aluna lê publicados" on public.cardapios
  for select to authenticated using (publicado and public.tem_acesso_ativo());

create policy "desafios: admin gerencia" on public.desafios
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "desafios: aluna lê publicados" on public.desafios
  for select to authenticated using (publicado and public.tem_acesso_ativo());

create policy "participantes: dona e admin leem" on public.desafio_participantes
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "participantes: aluna entra em desafio aberto" on public.desafio_participantes
  for insert to authenticated with check (
    perfil_id = auth.uid()
    and exists (
      select 1 from public.desafios d
      where d.id = desafio_id and d.publico = 'inscritas' and d.encerrado_em is null
        and public.hoje_brasilia() <= d.fim
    )
  );

create policy "checkins: dona e admin leem" on public.desafio_checkins
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "checkins: aluna marca o dia de hoje" on public.desafio_checkins
  for insert to authenticated with check (
    perfil_id = auth.uid()
    and dia = public.hoje_brasilia()
    and exists (
      select 1 from public.desafios d
      where d.id = desafio_id and d.encerrado_em is null
        and public.hoje_brasilia() between d.inicio and d.fim
        and (d.tipo_checkin <> 'numero' or valor is not null)
        and (d.tipo_checkin <> 'foto' or foto_path is not null)
        and (
          d.publico = 'todas'
          or exists (select 1 from public.desafio_participantes p where p.desafio_id = d.id and p.perfil_id = auth.uid())
        )
    )
  );

create policy "configuracoes: todos leem" on public.configuracoes
  for select to anon, authenticated using (true);
create policy "configuracoes: admin edita" on public.configuracoes
  for update to authenticated using (public.eh_admin()) with check (public.eh_admin());

create or replace function public.registrar_acesso()
returns void
language sql
security definer
set search_path = public
as $$
  update public.perfis set ultimo_acesso_em = now()
  where id = auth.uid() and (ultimo_acesso_em is null or ultimo_acesso_em < now() - interval '5 minutes');
$$;

create or replace function public.dias_cumpridos(p_desafio uuid, p_perfil uuid)
returns integer
language sql
stable
security invoker
set search_path = public
as $$
  select count(*)::integer
  from public.desafio_checkins c join public.desafios d on d.id = c.desafio_id
  where c.desafio_id = p_desafio and c.perfil_id = p_perfil
    and c.dia between d.inicio and d.fim
    and (d.tipo_checkin <> 'numero' or c.valor >= d.meta_diaria);
$$;

create or replace function public.painel_desafios()
returns table (id uuid, participantes integer, concluintes integer)
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
  with gente as (
    select p.desafio_id, p.perfil_id from public.desafio_participantes p
    union
    select c.desafio_id, c.perfil_id from public.desafio_checkins c
  )
  select d.id,
    (select count(*)::integer from gente g where g.desafio_id = d.id),
    (select count(*)::integer from gente g where g.desafio_id = d.id and public.dias_cumpridos(d.id, g.perfil_id) >= d.meta_dias)
  from public.desafios d;
end;
$$;

create or replace function public.vencedoras_desafio(p_desafio uuid)
returns table (perfil_id uuid, nome text, apelido text, dias integer)
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
  select pf.id, pf.nome, pf.apelido, public.dias_cumpridos(d.id, pf.id)
  from public.desafios d
  join public.perfis pf on pf.id in (
    select c.perfil_id from public.desafio_checkins c where c.desafio_id = d.id
  )
  where d.id = p_desafio and public.dias_cumpridos(d.id, pf.id) >= d.meta_dias
  order by 4 desc, pf.nome;
end;
$$;

create or replace function public.painel_alunas()
returns table (
  id uuid,
  nome text,
  apelido text,
  acesso_inicio_em timestamptz,
  acesso_fim_em timestamptz,
  ultimo_acesso_em timestamptz,
  dia integer,
  aulas_liberadas integer,
  aulas_concluidas integer
)
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
  with base as (
    select p.*,
      case when p.acesso_inicio_em <= now()
        then floor(extract(epoch from (now() - p.acesso_inicio_em)) / 86400)::integer + 1 end as dia_atual
    from public.perfis p
    where p.papel = 'aluna'
  )
  select b.id, b.nome, b.apelido, b.acesso_inicio_em, b.acesso_fim_em, b.ultimo_acesso_em, b.dia_atual,
    (select count(*)::integer from public.aulas a
       join public.etapas e on e.id = a.etapa_id join public.temas t on t.id = e.tema_id
       where a.publicado and e.publicado and t.publicado and a.dia_liberacao <= coalesce(b.dia_atual, 0)),
    (select count(*)::integer from public.aulas_concluidas c where c.perfil_id = b.id)
  from base b
  order by b.acesso_inicio_em desc nulls last, b.nome;
end;
$$;

create or replace function public.alunas_em_desafios_ativos()
returns integer
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_total integer;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  select count(distinct g.perfil_id)::integer into v_total
  from (
    select p.desafio_id, p.perfil_id from public.desafio_participantes p
    union
    select c.desafio_id, c.perfil_id from public.desafio_checkins c
  ) g
  join public.desafios d on d.id = g.desafio_id
  where d.publicado and d.encerrado_em is null and public.hoje_brasilia() between d.inicio and d.fim;
  return v_total;
end;
$$;

revoke all on function public.registrar_acesso(), public.dias_cumpridos(uuid, uuid), public.painel_desafios(), public.vencedoras_desafio(uuid), public.painel_alunas(), public.alunas_em_desafios_ativos() from public, anon;
grant execute on function public.registrar_acesso(), public.dias_cumpridos(uuid, uuid), public.painel_desafios(), public.vencedoras_desafio(uuid), public.painel_alunas(), public.alunas_em_desafios_ativos() to authenticated;

insert into public.configuracoes (pix_cheio, parcelado_cheio, recorrente_cheio, pix_oferta, parcelado_oferta, recorrente_oferta, oferta_inicio, oferta_fim, termos, privacidade, termos_atualizado_em, privacidade_atualizado_em)
values (229700, 22700, 24700, 199700, 19800, 21500, '2026-10-24T03:00:00Z', '2026-10-25T02:59:59Z',
  $termos$[{"titulo":"Quem somos","texto":"A HORA é uma comunidade de acompanhamento em saúde e hábitos, inscrita no CNPJ 52.877.749/0001-15. Estes termos valem para o uso deste site e da plataforma HORA."},{"titulo":"O que você contrata","texto":"Acesso por 12 meses (13 meses nas compras feitas no dia 24/10, durante a oferta do ORA) a trilhas de conteúdo, lives, check-ins, ranking e comunidade. O acesso é pessoal e não pode ser compartilhado."},{"titulo":"Pagamento","texto":"O pagamento é feito pelo Mercado Pago, à vista no Pix, parcelado no cartão ou em cobrança mensal recorrente. O acesso é liberado depois da confirmação do pagamento."},{"titulo":"Garantia e cancelamento","texto":"Você pode pedir a devolução integral em até 7 dias depois da compra. No plano mensal vale a fidelidade de 12 meses depois desse prazo. O contrato completo é enviado por e-mail depois da compra."},{"titulo":"Conteúdo e saúde","texto":"O conteúdo da HORA é educativo e não substitui consulta individual. Siga as orientações do seu médico para condições de saúde específicas."},{"titulo":"Convivência","texto":"Na comunidade, trate todas com respeito. Conteúdo ofensivo, propaganda ou divulgação de dados de outras pessoas pode levar à suspensão do acesso."},{"titulo":"Contato","texto":"TODO(clientes): e-mail de contato"}]$termos$::jsonb,
  $privacidade$[{"titulo":"Quais dados coletamos","texto":"Na compra: nome, e-mail, WhatsApp, a forma de pagamento escolhida e de onde você chegou ao site (como o nome da campanha). Na plataforma: os dados que você mesma registra, como check-ins, fotos e medidas."},{"titulo":"Para que usamos","texto":"Para liberar o seu acesso, falar com você sobre a compra e a comunidade, e entender quais campanhas trazem pessoas até a HORA. Medidas e fotos de evolução são suas e nunca entram em ranking."},{"titulo":"Com quem compartilhamos","texto":"Com os serviços que fazem a HORA funcionar: Mercado Pago (pagamento), Supabase (banco de dados) e Vercel (hospedagem). Não vendemos seus dados."},{"titulo":"Pagamento","texto":"Os dados do cartão e do Pix ficam com o Mercado Pago. A HORA não recebe nem guarda número de cartão."},{"titulo":"Seus direitos","texto":"Pela LGPD, você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo contato abaixo."},{"titulo":"Contato","texto":"TODO(clientes): e-mail de contato"}]$privacidade$::jsonb,
  '2026-10-05T12:00:00Z', '2026-10-05T12:00:00Z');
