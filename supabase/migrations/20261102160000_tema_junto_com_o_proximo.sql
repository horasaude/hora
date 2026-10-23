alter table public.temas drop constraint temas_dias_liberado_check;
alter table public.temas add constraint temas_dias_liberado_check check (dias_liberado between 0 and 365);
