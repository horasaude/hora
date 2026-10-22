alter table public.lives
  add column descricao text not null default '' check (char_length(descricao) <= 2000);
