create or replace function public.encerrar_pedido(p_pedido uuid, p_status text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido public.pedidos;
begin
  if p_status not in ('reembolsado', 'cancelado', 'chargeback') then
    raise exception 'status inválido' using errcode = '22023';
  end if;
  select * into v_pedido from public.pedidos where id = p_pedido for update;
  if not found then
    raise exception 'pedido não encontrado' using errcode = 'P0002';
  end if;
  if v_pedido.status = p_status or v_pedido.status in ('reembolsado', 'chargeback') then
    return false;
  end if;
  update public.pedidos set status = p_status, encerrado_em = now() where id = p_pedido;
  update public.assinaturas set status = 'cancelada' where pedido_id = p_pedido and status <> 'concluida';
  if v_pedido.status = 'aprovado' and v_pedido.perfil_id is not null
    and not exists (
      select 1 from public.pedidos o
      where o.perfil_id = v_pedido.perfil_id and o.id <> p_pedido and o.status = 'aprovado'
    ) then
    update public.perfis set acesso_fim_em = now()
    where id = v_pedido.perfil_id and (acesso_fim_em is null or acesso_fim_em > now());
    update public.indicacoes set status = 'cancelada', motivo_cancelamento = 'compra desfeita'
    where lower(indicada_email) = lower(v_pedido.email) and status = 'aguardando';
  end if;
  return true;
end;
$$;

revoke all on function public.encerrar_pedido(uuid, text) from public, anon, authenticated;
grant execute on function public.encerrar_pedido(uuid, text) to service_role;
