create or replace function public.avulsas_para_conferir()
returns table (pedido uuid, cobranca text)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.mp_pagamento_id
  from public.pedidos p
  where p.plano in ('pix', 'parcelado')
    and p.status = 'aprovado'
    and p.mp_pagamento_id is not null
    and p.aprovado_em > now() - interval '60 days';
$$;

revoke all on function public.avulsas_para_conferir() from public, anon, authenticated;
grant execute on function public.avulsas_para_conferir() to service_role;
