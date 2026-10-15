create unique index perfis_apelido_unico on public.perfis (lower(apelido)) where apelido is not null;
