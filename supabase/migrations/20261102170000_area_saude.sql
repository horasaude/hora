alter table public.materiais_nutricao add column area text not null default 'nutricao' check (area in ('nutricao', 'saude'));
alter table public.anamneses add column area text not null default 'treino' check (area in ('treino', 'nutricao', 'saude'));
create index materiais_nutricao_area_idx on public.materiais_nutricao (area);
