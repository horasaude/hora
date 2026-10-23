alter table public.pedidos add column rastreio jsonb not null default '{}'::jsonb;
