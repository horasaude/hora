create or replace function public.encerrar_parceria(p_perfil uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if not exists (select 1 from public.parceiras where perfil_id = p_perfil) then
    raise exception 'nao_parceira' using errcode = 'P0002';
  end if;
  update public.perfis
  set acesso_fim_em = now(), acesso_inicio_em = least(acesso_inicio_em, now() - interval '1 second')
  where id = p_perfil and acesso_fim_em > now();
end;
$$;

revoke all on function public.encerrar_parceria(uuid) from public, anon;
grant execute on function public.encerrar_parceria(uuid) to authenticated;
