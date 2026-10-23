alter table public.receitas add column tema_id uuid references public.temas (id) on delete set null;
alter table public.materiais_nutricao add column tema_id uuid references public.temas (id) on delete set null;

create index receitas_tema_idx on public.receitas (tema_id);
create index materiais_nutricao_tema_idx on public.materiais_nutricao (tema_id);
