create table public.materiais_nutricao (
  id uuid primary key default gen_random_uuid(),
  titulo text not null check (char_length(trim(titulo)) between 1 and 160),
  texto text not null default '' check (char_length(texto) <= 20000),
  publicado boolean not null default false,
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger materiais_nutricao_updated_at before update on public.materiais_nutricao
  for each row execute function public.tocar_updated_at();

alter table public.materiais_nutricao enable row level security;
revoke all on public.materiais_nutricao from anon, authenticated;
grant select, insert, update, delete on public.materiais_nutricao to authenticated;
create policy "materiais nutrição: admin gerencia" on public.materiais_nutricao
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "materiais nutrição: aluna lê os publicados" on public.materiais_nutricao
  for select to authenticated using (publicado and public.tem_acesso_ativo());

insert into public.materiais_nutricao (titulo, texto, publicado, ordem) values
  ('Chás diuréticos', '• Gengibre com limão
• Hibisco com canela
• Cavalinha
• Dente-de-leão com canela

Preparo: coloque a água para ferver. Quando levantar fervura, apague o fogo e coloque 1 colher de sopa cheia da erva escolhida.
Tampe e deixe em infusão por 15 minutos. Misture com água gelada na garrafinha e vá tomando no decorrer da manhã.', true, 1),
  ('Lista de frutas', 'Abacate: 2 colheres de sopa
Abacaxi: 2 fatias
Ameixa vermelha: 4 unidades
Banana prata: 1 unidade
Damasco seco: 4 unidades
Goiaba: 2 unidades pequenas
Kiwi: 2 unidades pequenas
Laranja: 1 unidade média
Maçã: 1 unidade
Mamão papaia: 1/2 unidade
Manga: 1 unidade
Melancia: 1 fatia
Melão: 2 fatias
Morango: 5 unidades
Nectarina: 3 unidades
Pera: 1 unidade
Pêssego: 1 unidade
Tangerina: 1 unidade
Uva: 8 unidades', true, 2),
  ('Manejo de ansiedade (óleos essenciais)', 'Lavanda (antes de dormir)
1 gota no umbigo ou 1 gota na sola dos pés ou 2 gotas na mão (espalhar sem aquecer e inalar 6 vezes) ou 1 gota no travesseiro ou 5 gotas no difusor.

Balance (durante o dia)
2 gotas nas mãos (espalhar sem aquecer e inalar 5 vezes) sempre que se sentir ansiosa ou agitada.', true, 3),
  ('Molhos para salada', 'Molho 1
3 colheres de sopa de azeite extra virgem + caldo de 1 limão + 15 folhas de hortelã + 1 dente de alho amassado + temperos secos

Molho 2
1 pote de iogurte natural + 3 colheres de sopa de azeite extra virgem + caldo de 1 limão + 8 folhas de manjericão + 1 dente de alho amassado + 1 pitada de sal

Molho 3
1 colher de sopa de queijo parmesão + 3 colheres de sopa de azeite extra virgem + 1 colher de sopa de nozes picadas + meio maço de espinafre + 1 dente de alho amassado + caldo de meio limão

Molho 4
4 colheres de sopa de vinagre de maçã + 2 colheres de sopa de azeite + sal a gosto + 1 dente de alho amassado + 1 colher de sopa de folhas de alecrim

Molho 5
1 pote de iogurte natural + meio pacote de queijo parmesão ralado + suco de 1 limão + 2 colheres de sopa de mostarda', true, 4),
  ('Monte sua salada', '1. Vegetais folhosos
Alface lisa, americana, crespa, mimosa ou roxa
Rúcula
Couve
Agrião
Folha de mostarda

2. Adicione mais verduras e legumes crus
Rabanete
Abobrinha
Brócolis
Pepino
Tomate-cereja
Cebola
Berinjela
Chuchu
Couve-flor
Cenoura
Palmito

3. Adicione algo crocante ou doce para um sabor extra
Nozes
Semente de abóbora
Semente de linhaça
Semente de chia
Quinoa
Castanhas em geral

4. Adicione uma ou mais proteínas (opcional)
Frango grelhado picado ou desfiado
Ovos cozidos
Ovos de codorna
Camarão
Carne picada', true, 5);
