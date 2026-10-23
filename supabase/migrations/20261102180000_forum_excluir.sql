create or replace function public.forum_excluir(p_topico uuid, p_resposta uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lanc uuid;
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if (p_topico is null) = (p_resposta is null) then
    raise exception 'escolha a dúvida ou a resposta' using errcode = '22023';
  end if;
  if p_topico is not null then
    for v_lanc in
      select l.id from public.lancamentos_pontos l
      where l.referencia = p_topico::text and l.acao in ('duvida_forum', 'duvida_util') and l.pontos > 0
    loop
      perform public.estornar_lancamento(v_lanc, 'Dúvida excluída pela equipe', auth.uid());
    end loop;
    delete from public.forum_topicos where id = p_topico;
  else
    delete from public.forum_respostas where id = p_resposta;
  end if;
end;
$$;

revoke all on function public.forum_excluir(uuid, uuid) from public, anon;
grant execute on function public.forum_excluir(uuid, uuid) to authenticated;
