alter table public.regras_pontos add column propria boolean not null default false;

alter table public.regras_pontos
  drop constraint regras_pontos_acao_check,
  add constraint regras_pontos_acao_check check (
    acao in ('treino_foto', 'agua', 'cardio', 'tarefa', 'foto_refeicao', 'aula_concluida', 'duvida_forum', 'duvida_util', 'live', 'indicacao')
    or acao ~ '^extra_[a-f0-9]{8}$'
  ),
  add constraint regras_pontos_propria_check check (propria = (acao ~ '^extra_'));

alter table public.lancamentos_pontos
  drop constraint lancamentos_pontos_acao_check,
  add constraint lancamentos_pontos_acao_check check (
    acao in ('treino_foto', 'agua', 'cardio', 'tarefa', 'foto_refeicao', 'aula_concluida', 'duvida_forum', 'duvida_util', 'live', 'indicacao', 'desafio_checkin', 'desafio_bonus', 'ajuste', 'estorno')
    or acao ~ '^extra_[a-f0-9]{8}$'
  );

grant update (nome) on public.regras_pontos to authenticated;

create or replace function public.criar_acao(p_nome text, p_pontos integer, p_limite_tipo text, p_limite_qtd integer)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_acao text := 'extra_' || substr(md5(gen_random_uuid()::text), 1, 8);
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  insert into public.regras_pontos (acao, nome, pontos, limite_tipo, limite_qtd, ordem, propria)
  values (
    v_acao, btrim(p_nome), p_pontos, p_limite_tipo,
    case when p_limite_tipo = 'por_dia' then p_limite_qtd end,
    coalesce((select max(ordem) from public.regras_pontos), 0) + 1, true
  );
  return v_acao;
end;
$$;

create or replace function public.dar_pontos_acao(p_acao text, p_perfis uuid[])
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_regra public.regras_pontos;
  v_perfil uuid;
  v_total integer := 0;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  select * into v_regra from public.regras_pontos where acao = p_acao and propria;
  if not found then
    raise exception 'ação não encontrada' using errcode = '22023';
  end if;
  for v_perfil in select p.id from public.perfis p where p.id = any (p_perfis) and p.papel = 'aluna' loop
    if v_regra.limite_tipo = 'por_referencia' and exists (
      select 1 from public.lancamentos_pontos l
      where l.perfil_id = v_perfil and l.acao = p_acao and l.pontos > 0
        and not exists (select 1 from public.lancamentos_pontos e where e.estorna = l.id)
    ) then
      continue;
    end if;
    if public.conceder_pontos(v_perfil, p_acao, 'painel', null, null, null, auth.uid()) is not null then
      v_total := v_total + 1;
    end if;
  end loop;
  return v_total;
end;
$$;

revoke all on function public.criar_acao(text, integer, text, integer), public.dar_pontos_acao(text, uuid[]) from public, anon;
grant execute on function public.criar_acao(text, integer, text, integer), public.dar_pontos_acao(text, uuid[]) to authenticated;
