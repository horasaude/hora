alter table public.lives add column capa_url text check (capa_url ~ '^https://');
