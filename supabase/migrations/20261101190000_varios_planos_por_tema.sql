create or replace function public.cardapio_tema_do_objetivo()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.tema_id is not null then
    if new.objetivo is null or btrim(new.objetivo) = '' then
      select left(t.titulo, 80) into new.objetivo from public.temas t where t.id = new.tema_id;
    end if;
  elsif new.objetivo is not null and (tg_op = 'INSERT' or new.objetivo is distinct from old.objetivo) then
    select t.id into new.tema_id from public.temas t
    where t.titulo = new.objetivo or (new.objetivo = 'Preparação' and t.chave = 'preparacao')
    order by t.ordem limit 1;
  end if;
  return new;
end;
$$;
