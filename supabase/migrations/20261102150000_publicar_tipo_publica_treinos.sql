create or replace function public.publicar_treinos_da_rotina()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_table_name = 'rotinas' then
    if new.publicado and (tg_op = 'INSERT' or not old.publicado) then
      update public.treinos t set publicado = true
      from public.rotina_treinos rt
      where rt.rotina_id = new.id and rt.treino_id = t.id and not t.publicado;
    end if;
  elsif exists (select 1 from public.rotinas r where r.id = new.rotina_id and r.publicado) then
    update public.treinos set publicado = true where id = new.treino_id and not publicado;
  end if;
  return new;
end;
$$;

revoke all on function public.publicar_treinos_da_rotina() from public, anon, authenticated;

create trigger rotinas_publica_treinos
after insert or update of publicado on public.rotinas
for each row execute function public.publicar_treinos_da_rotina();

create trigger rotina_treinos_publica_treino
after insert or update of treino_id, rotina_id on public.rotina_treinos
for each row execute function public.publicar_treinos_da_rotina();

update public.treinos t set publicado = true
from public.rotina_treinos rt
join public.rotinas r on r.id = rt.rotina_id
where rt.treino_id = t.id and r.publicado and not t.publicado;
