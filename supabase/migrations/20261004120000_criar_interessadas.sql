create table public.interessadas (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254 and email like '%_@_%._%'),
  whatsapp text not null check (whatsapp ~ '^[0-9]{10,11}$'),
  plano_escolhido text not null check (plano_escolhido in ('pix', 'parcelado', 'recorrente')),
  aceitou_termos_em timestamptz not null,
  versao_termos text not null check (char_length(versao_termos) between 1 and 40),
  origem text check (char_length(origem) <= 500),
  utm_source text check (char_length(utm_source) <= 200),
  utm_medium text check (char_length(utm_medium) <= 200),
  utm_campaign text check (char_length(utm_campaign) <= 200),
  utm_content text check (char_length(utm_content) <= 200),
  utm_term text check (char_length(utm_term) <= 200),
  created_at timestamptz not null default now()
);

create index interessadas_email_idx on public.interessadas (email);
create index interessadas_created_at_idx on public.interessadas (created_at desc);

alter table public.interessadas enable row level security;

revoke all on public.interessadas from anon, authenticated;
grant select on public.interessadas to authenticated;

create policy "interessadas: admin lê" on public.interessadas
  for select to authenticated using (public.eh_admin());
