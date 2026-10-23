create table public.material_arquivos (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.materiais_nutricao (id) on delete cascade,
  tipo text not null check (tipo in ('pdf', 'imagem', 'word', 'link')),
  caminho text not null check (char_length(caminho) between 1 and 500),
  nome text not null check (char_length(nome) between 1 and 160),
  tamanho bigint check (tamanho between 0 and 20971520),
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  check ((tipo = 'link') = (caminho ~ '^https://')),
  check (tipo = 'link' or caminho like 'apoio/%')
);
create index material_arquivos_material_idx on public.material_arquivos (material_id, ordem);

alter table public.material_arquivos enable row level security;
revoke all on public.material_arquivos from anon, authenticated;
grant select, insert, update, delete on public.material_arquivos to authenticated;
create policy "material arquivos: admin gerencia" on public.material_arquivos
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "material arquivos: aluna lê os do material publicado" on public.material_arquivos
  for select to authenticated using (
    public.tem_acesso_ativo() and exists (
      select 1 from public.materiais_nutricao m
      where m.id = material_id and m.publicado and (m.tema_id is null or public.tema_aberto(m.tema_id))
    )
  );

create or replace function public.salvar_materiais_apoio(p_material uuid, p_itens jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  delete from public.material_arquivos where material_id = p_material;
  insert into public.material_arquivos (material_id, tipo, caminho, nome, tamanho, ordem)
  select p_material, i ->> 'tipo', i ->> 'caminho', left(trim(i ->> 'nome'), 160), nullif(i ->> 'tamanho', '')::bigint, (ordinality - 1)::integer
  from jsonb_array_elements(coalesce(p_itens, '[]'::jsonb)) with ordinality as e(i, ordinality);
end;
$$;
revoke all on function public.salvar_materiais_apoio(uuid, jsonb) from public, anon;
grant execute on function public.salvar_materiais_apoio(uuid, jsonb) to authenticated;
