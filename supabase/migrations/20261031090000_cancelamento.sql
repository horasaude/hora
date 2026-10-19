alter table public.pedidos
  add column cancelamento_pedido_em timestamptz,
  add column cancelamento_tipo text check (cancelamento_tipo in ('arrependimento', 'nao_renovar')),
  add column cancelamento_motivo text check (char_length(cancelamento_motivo) <= 500),
  add constraint pedidos_cancelamento_completo check ((cancelamento_pedido_em is null) = (cancelamento_tipo is null));

create index pedidos_cancelamento on public.pedidos (cancelamento_pedido_em) where cancelamento_pedido_em is not null;
