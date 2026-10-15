create or replace function public.meus_pontos_do_dia()
returns table (acao text, nome text, pontos integer, limite_tipo text, limite_qtd integer, feitas_hoje integer, pontos_hoje integer, propria boolean, ordem integer)
language sql
stable
security definer
set search_path = public
as $$
  select r.acao, r.nome, r.pontos, r.limite_tipo, r.limite_qtd,
    coalesce(h.qtd, 0)::integer, coalesce(h.soma, 0)::integer, r.propria, r.ordem
  from public.regras_pontos r
  left join (
    select l.acao, count(*) as qtd, sum(l.pontos) as soma
    from public.lancamentos_pontos l
    where l.perfil_id = auth.uid() and l.dia = public.hoje_brasilia() and l.pontos > 0
    group by l.acao
  ) h on h.acao = r.acao
  where r.ativo and r.pontos > 0 and auth.uid() is not null
    and (public.tem_acesso_ativo() or public.eh_admin())
  order by r.ordem, r.nome;
$$;

revoke all on function public.meus_pontos_do_dia() from public, anon;
grant execute on function public.meus_pontos_do_dia() to authenticated;
