create or replace function public.ranking_pontos(p_periodo text)
returns table (posicao integer, apelido text, pontos integer, eu boolean)
language sql
stable
security definer
set search_path = public
as $$
  with inicio as (
    select case when p_periodo = 'ano' then date_trunc('year', public.hoje_brasilia())::date
      else date_trunc('month', public.hoje_brasilia())::date end as dia
  ),
  somas as (
    select l.perfil_id, sum(l.pontos)::integer as total
    from public.lancamentos_pontos l, inicio i
    where l.dia >= i.dia
    group by l.perfil_id
  ),
  gente as (
    select p.id, coalesce(nullif(p.apelido, ''), 'aluna') as nome, coalesce(s.total, 0) as total
    from public.perfis p left join somas s on s.perfil_id = p.id
    where (p.papel = 'aluna' or p.id = auth.uid())
      and (p.id = auth.uid() or (not p.ocultar_ranking and coalesce(s.total, 0) > 0))
  )
  select (row_number() over (order by g.total desc, g.nome))::integer, g.nome, g.total, g.id = auth.uid()
  from gente g
  where public.eh_admin() or public.tem_acesso_ativo()
  order by 1;
$$;
