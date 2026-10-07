update public.etapas set titulo = 'Para Sempre' where chave = 'manutencao' and titulo = 'Manutenção';

alter table public.cardapios
  drop constraint cardapios_objetivo_valido,
  add constraint cardapios_objetivo_valido check (
    objetivo in ('Preparação', 'Emagrecimento', 'Composição corporal', 'Lipedema', 'Menopausa', 'Ganho de massa')
  );

create or replace function public.objetivo_da_aluna()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case t.chave
    when 'emagrecimento' then 'Emagrecimento'
    when 'composicao' then 'Composição corporal'
    when 'lipedema' then 'Lipedema'
    when 'menopausa' then 'Menopausa'
    when 'ganho_massa' then 'Ganho de massa'
    else 'Preparação'
  end
  from public.perfis p
  left join public.temas t on t.id = p.tema_atual_id and t.tipo = 'tema'
  where p.id = auth.uid();
$$;

drop policy "cardapios: aluna lê publicados" on public.cardapios;
create policy "cardapios: aluna lê publicados do seu tema" on public.cardapios
  for select to authenticated using (
    publicado and public.tem_acesso_ativo() and objetivo = public.objetivo_da_aluna()
  );

revoke all on function public.objetivo_da_aluna() from public, anon;
grant execute on function public.objetivo_da_aluna() to authenticated;
