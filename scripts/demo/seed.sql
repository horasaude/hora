do $$
begin
  if exists (select 1 from pg_roles where rolname in ('supabase_admin', 'authenticator', 'supabase_auth_admin')) then
    raise exception 'Seed de demonstração: roda só no banco local em memória (scripts/demo), nunca no Supabase.';
  end if;
end;
$$;

create function pg_temp.quando(p_dias_atras integer, p_hora integer) returns timestamptz language sql as $$
  select (public.hoje_brasilia() - p_dias_atras)::timestamp at time zone 'America/Sao_Paulo' + make_interval(hours => p_hora);
$$;

insert into auth.users (id, email, raw_user_meta_data) values
  ('aaaaaaaa-0000-0000-0000-000000000003', 'bia.demo@exemplo.com', '{"nome": "Beatriz Santos"}'),
  ('aaaaaaaa-0000-0000-0000-000000000040', 'mari.demo@exemplo.com', '{"nome": "Mariana Souza"}'),
  ('aaaaaaaa-0000-0000-0000-000000000099', 'equipe.demo@exemplo.com', '{"nome": "Equipe ORA"}');
update public.perfis set papel = 'admin', apelido = 'equipe' where id = 'aaaaaaaa-0000-0000-0000-000000000099';

insert into auth.users (id, email, raw_user_meta_data)
select ('aaaaaaaa-0000-0000-0000-0000000001' || lpad(n::text, 2, '0'))::uuid, 'aluna' || n || '.demo@exemplo.com', jsonb_build_object('nome', 'Aluna ' || n)
from generate_series(1, 10) n;

update public.perfis set apelido = 'bia', consentimento_saude_em = now(), acesso_inicio_em = pg_temp.quando(2, 9), codigo_indicacao = 'BIA2026'
where id = 'aaaaaaaa-0000-0000-0000-000000000003';
update public.perfis set apelido = 'mari', consentimento_saude_em = now(), acesso_inicio_em = pg_temp.quando(39, 10), codigo_indicacao = 'MARI2026',
  tema_atual_id = (select id from public.temas where chave = 'emagrecimento')
where id = 'aaaaaaaa-0000-0000-0000-000000000040';
update public.perfis p set consentimento_saude_em = now(), acesso_inicio_em = pg_temp.quando(20 + n, 8),
  apelido = (array['flor.de.lis', 'julia_fit', 'renatinha', 'cris.s', 'bia.move', 'lu_sorriso', 'paty.run', 'nanda', 'gabi.leve', 'carol_b'])[n]
from generate_series(1, 10) n
where p.id = ('aaaaaaaa-0000-0000-0000-0000000001' || lpad(n::text, 2, '0'))::uuid;

update public.comece_aqui set video_url = 'https://www.youtube.com/watch?v=demoORA001';

insert into public.aulas (etapa_id, titulo, video_url, dia_liberacao, ordem, publicado, duracao_minutos, profissional, descricao)
select e.id, a.titulo, 'https://www.youtube.com/watch?v=demoORA' || lpad(a.dia::text, 3, '0'), a.dia, a.dia, true, a.min, a.prof,
  'Aula de demonstração da preparação. ' || a.titulo || ' em poucos minutos, com um passo prático para hoje.'
from public.etapas e join public.temas t on t.id = e.tema_id,
  (values (1, 'Boas-vindas à ORA', 'Ana', 8), (2, 'Como funciona a trilha', 'Laís', 6), (3, 'O prato que sacia', 'Ana', 12),
          (4, 'Movimento no dia a dia', 'Laís', 10), (5, 'Sono e fome', 'Clara', 11), (6, 'Água e intestino', 'Clara', 7),
          (7, 'Seu plano para o mês', 'Ana', 9)) as a(dia, titulo, prof, min)
where t.chave = 'preparacao';

insert into public.aulas (etapa_id, titulo, video_url, dia_liberacao, ordem, publicado, duracao_minutos, profissional, descricao)
select e.id, e.titulo || ' ' || n || ': ' || (array['Metabolismo na prática', 'Treino de 20 minutos', 'Montando o prato', 'Fome emocional',
    'Treino em casa', 'Lanches que funcionam', 'Hormônios e fome', 'Caminhada com intervalos', 'Rótulos sem mistério', 'Fechando a etapa'])[n],
  'https://www.youtube.com/watch?v=demoORA' || lpad((n + 100)::text, 3, '0'),
  (array[1, 3, 6, 9, 12, 15, 18, 21, 24, 27])[n], n, true, 6 + n, (array['Clara', 'Laís', 'Ana'])[1 + n % 3],
  'Nesta aula você entende o porquê e sai com um passo simples para colocar em prática ainda hoje.'
from public.etapas e join public.temas t on t.id = e.tema_id, generate_series(1, 10) n
where t.chave in ('emagrecimento', 'composicao');

insert into public.etapas_iniciadas (perfil_id, etapa_id, iniciada_em)
select 'aaaaaaaa-0000-0000-0000-000000000040', e.id, public.hoje_brasilia() - case e.chave when 'arrancada' then 31 else 1 end
from public.etapas e join public.temas t on t.id = e.tema_id
where t.chave = 'emagrecimento' and e.chave in ('arrancada', 'constancia');

insert into public.aulas_concluidas (perfil_id, aula_id)
select 'aaaaaaaa-0000-0000-0000-000000000040', a.id
from public.aulas a join public.etapas e on e.id = a.etapa_id join public.temas t on t.id = e.tema_id
where t.chave = 'preparacao' or (t.chave = 'emagrecimento' and e.chave = 'arrancada');

insert into public.aulas_concluidas (perfil_id, aula_id)
select 'aaaaaaaa-0000-0000-0000-000000000003', a.id
from public.aulas a join public.etapas e on e.id = a.etapa_id join public.temas t on t.id = e.tema_id
where t.chave = 'preparacao' and a.dia_liberacao <= 2;

insert into public.comece_aqui_feitos (perfil_id, item)
select 'aaaaaaaa-0000-0000-0000-000000000040', i from unnest(array['perfil', 'medidas', 'foto', 'regras', 'app']) i;
insert into public.comece_aqui_feitos (perfil_id, item) values
  ('aaaaaaaa-0000-0000-0000-000000000003', 'regras'), ('aaaaaaaa-0000-0000-0000-000000000003', 'perfil');

insert into public.medidas (perfil_id, dia, peso, cintura, quadril, braco, coxa)
select 'aaaaaaaa-0000-0000-0000-000000000040', public.hoje_brasilia() - s * 7, 71.0 + s * 0.8, 81 + s * 1.2, 99 + s * 0.6, 29.5 + s * 0.3, 56 + s * 0.5
from generate_series(0, 5) s;

insert into public.checkins (perfil_id, tipo, dia)
select 'aaaaaaaa-0000-0000-0000-000000000040', t, public.hoje_brasilia() - d
from generate_series(1, 5) d, unnest(array['agua', 'cardio']) t;
select public.conceder_pontos('aaaaaaaa-0000-0000-0000-000000000040', 'agua', 'checkin', 'demo-agua');
insert into public.checkins (perfil_id, tipo, dia) values ('aaaaaaaa-0000-0000-0000-000000000040', 'agua', public.hoje_brasilia());
select public.conceder_pontos(('aaaaaaaa-0000-0000-0000-0000000001' || lpad(n::text, 2, '0'))::uuid, 'ajuste', 'demo', null, 1300 - n * 70, 'Demonstração')
from generate_series(1, 10) n;
select public.conceder_pontos('aaaaaaaa-0000-0000-0000-000000000040', 'ajuste', 'demo', null, 640, 'Demonstração');

insert into public.desafios (nome, descricao, inicio, fim, tipo_checkin, unidade, meta_diaria, meta_dias, pontos_por_dia, bonus_conclusao, premio, premio_surpresa, publicado)
values ('21 dias de água', 'Beba pelo menos 8 copos de água por dia e veja o calendário ficar verde.', public.hoje_brasilia() - 12,
  public.hoje_brasilia() + 8, 'numero', 'copos', 8, 18, 10, 100, 'Garrafa térmica ORA', true, true);
insert into public.desafio_participantes (desafio_id, perfil_id)
select d.id, p.id from public.desafios d, public.perfis p where p.apelido in ('mari', 'flor.de.lis', 'julia_fit', 'renatinha');
insert into public.desafio_checkins (desafio_id, perfil_id, dia, valor)
select d.id, 'aaaaaaaa-0000-0000-0000-000000000040', public.hoje_brasilia() - g, 8 + g % 3
from public.desafios d, generate_series(1, 12) g where g <> 5;

create function pg_temp.op(p_nome text, p_medida text, p_qtd numeric, p_gramas numeric) returns jsonb language sql as $$
  select jsonb_build_object('tipo', 'alimento', 'ref_id', a.id, 'nome', a.nome, 'grupo', a.grupo, 'medida', p_medida,
    'gramas_medida', p_gramas / p_qtd, 'quantidade', p_qtd, 'gramas', p_gramas,
    'nutrientes', jsonb_build_object('kcal', coalesce(a.kcal, 0) * p_gramas / 100, 'proteina', coalesce(a.proteina, 0) * p_gramas / 100,
      'carboidrato', greatest(coalesce(a.carboidrato, 0), 0) * p_gramas / 100, 'gordura', coalesce(a.gordura, 0) * p_gramas / 100,
      'fibra', coalesce(a.fibra, 0) * p_gramas / 100))
  from public.alimentos a where a.nome = p_nome limit 1;
$$;

insert into public.receitas (nome, ingredientes, preparo, porcoes, tags, calcular, publicado, tempo_minutos, refeicoes, objetivos) values
  ('Panqueca de banana com aveia', '<ul><li>1 banana prata</li><li>2 ovos</li><li>3 colheres de sopa de aveia</li><li>Canela a gosto</li></ul>',
   '<p>Amasse a banana com um garfo.</p><p>Misture os ovos, a aveia e a canela.</p><p>Doure metade da massa numa frigideira antiaderente.</p><p>Vire, doure o outro lado e repita.</p>',
   2, '{café}', true, true, 15, '{cafe,lanche}', '{Emagrecimento}'),
  ('Omelete de legumes', '<ul><li>2 ovos</li><li>Meia cenoura ralada</li><li>Tomate picado</li><li>Sal e cheiro-verde</li></ul>',
   '<p>Bata os ovos com sal.</p><p>Junte a cenoura e o tomate.</p><p>Cozinhe em fogo baixo, tampado, até firmar.</p>',
   1, '{jantar}', true, true, 10, '{jantar,cafe}', '{}'),
  ('Frango ao limão', '<ul><li>500 g de peito de frango</li><li>Suco de 2 limões</li><li>1 colher de azeite</li></ul>',
   '<p>Tempere o frango com limão, sal e alho.</p><p>Deixe pegar gosto por 20 minutos.</p><p>Grelhe dos dois lados até dourar.</p>',
   4, '{almoço}', true, true, 30, '{almoco,jantar}', '{Emagrecimento,Ganho de massa}'),
  ('Creme de abóbora', '<ul><li>500 g de abóbora cabotiá</li><li>1 cebola</li><li>Gengibre a gosto</li></ul>',
   '<p>Cozinhe a abóbora com a cebola.</p><p>Bata no liquidificador com a água do cozimento.</p><p>Volte ao fogo com gengibre.</p>',
   4, '{jantar}', true, true, 35, '{jantar,ceia}', '{Lipedema}');

insert into public.receita_itens (receita_id, alimento_id, gramas, ordem)
select r.id, a.id, i.gramas, i.ordem
from (values
  ('Panqueca de banana com aveia', 'Banana, prata, crua', 90, 0), ('Panqueca de banana com aveia', 'Ovo, de galinha, inteiro, cru', 100, 1),
  ('Panqueca de banana com aveia', 'Aveia, flocos, crua', 45, 2), ('Omelete de legumes', 'Ovo, de galinha, inteiro, cru', 100, 0),
  ('Omelete de legumes', 'Cenoura, crua', 40, 1), ('Omelete de legumes', 'Tomate, com semente, cru', 60, 2),
  ('Frango ao limão', 'Frango, peito, sem pele, cru', 500, 0), ('Frango ao limão', 'Limão, tahiti, cru', 60, 1),
  ('Frango ao limão', 'Azeite, de oliva, extra virgem', 10, 2), ('Creme de abóbora', 'Abóbora, cabotian, cozida', 500, 0)
) as i(receita, alimento, gramas, ordem)
join public.receitas r on r.nome = i.receita join public.alimentos a on a.nome = i.alimento;

create function pg_temp.rec(p_nome text, p_qtd numeric) returns jsonb language sql as $$
  select jsonb_build_object('tipo', 'receita', 'ref_id', r.id, 'nome', r.nome, 'grupo', '', 'medida', 'porção', 'gramas_medida', 0,
    'quantidade', p_qtd, 'gramas', 0, 'nutrientes', jsonb_build_object(
      'kcal', sum(coalesce(a.kcal, 0) * i.gramas / 100) / r.porcoes * p_qtd,
      'proteina', sum(coalesce(a.proteina, 0) * i.gramas / 100) / r.porcoes * p_qtd,
      'carboidrato', sum(greatest(coalesce(a.carboidrato, 0), 0) * i.gramas / 100) / r.porcoes * p_qtd,
      'gordura', sum(coalesce(a.gordura, 0) * i.gramas / 100) / r.porcoes * p_qtd,
      'fibra', sum(coalesce(a.fibra, 0) * i.gramas / 100) / r.porcoes * p_qtd))
  from public.receitas r join public.receita_itens i on i.receita_id = r.id join public.alimentos a on a.id = i.alimento_id
  where r.nome = p_nome group by r.id, r.nome, r.porcoes;
$$;

create function pg_temp.item(variadic p_opcoes jsonb[]) returns jsonb language sql as $$
  select jsonb_build_object('opcoes', to_jsonb(p_opcoes));
$$;

create function pg_temp.refeicao(p_id text, p_nome text, p_horario text, p_itens jsonb[], p_obs text default '') returns jsonb language sql as $$
  select jsonb_build_object('id', p_id, 'nome', p_nome, 'horario', p_horario, 'itens', to_jsonb(p_itens), 'texto', '',
    'observacao', p_obs, 'substitutas', '[]'::jsonb);
$$;

insert into public.cardapios (objetivo, titulo, descricao, publicado, modelo, refeicoes) values
('Preparação', 'Primeira semana leve', 'Uma semana para organizar a rotina, sem cortes radicais.', true, 'calculado', jsonb_build_array(
  pg_temp.refeicao('p1', 'Café da manhã', '07:30', array[
    pg_temp.item(pg_temp.op('Pão, trigo, forma, integral', 'fatia', 2, 50), pg_temp.op('Tapioca, com manteiga', 'unidade', 1, 60)),
    pg_temp.item(pg_temp.op('Queijo, minas, frescal', 'fatia', 1, 30)),
    pg_temp.item(pg_temp.op('Mamão, Formosa, cru', 'fatia média', 1, 120))]),
  pg_temp.refeicao('p2', 'Almoço', '12:30', array[
    pg_temp.item(pg_temp.op('Arroz, integral, cozido', 'colher de servir', 2, 90)),
    pg_temp.item(pg_temp.op('Feijão, carioca, cozido', 'concha', 1, 86)),
    pg_temp.item(pg_temp.rec('Frango ao limão', 1)),
    pg_temp.item(pg_temp.op('Alface, crespa, crua', 'g', 60, 60))], 'Metade do prato com salada.'),
  pg_temp.refeicao('p3', 'Lanche da tarde', '16:00', array[
    pg_temp.item(pg_temp.op('Iogurte, natural', 'pote', 1, 170)),
    pg_temp.item(pg_temp.op('Banana, prata, crua', 'unidade', 1, 90))]),
  pg_temp.refeicao('p4', 'Jantar', '19:30', array[
    pg_temp.item(pg_temp.rec('Omelete de legumes', 1)),
    pg_temp.item(pg_temp.op('Abobrinha, italiana, refogada', 'g', 100, 100))])
)),
('Emagrecimento', 'Semana leve', 'Comida de verdade, saciedade e praticidade para os dias corridos.', true, 'calculado', jsonb_build_array(
  pg_temp.refeicao('e1', 'Café da manhã', '07:00', array[
    pg_temp.item(pg_temp.rec('Panqueca de banana com aveia', 1)),
    pg_temp.item(pg_temp.op('Café, infusão 10%', 'xícara', 1, 100)),
    pg_temp.item(pg_temp.op('Mamão, Formosa, cru', 'fatia média', 1, 100), pg_temp.op('Maçã, Fuji, com casca, crua', 'unidade', 1, 130))]),
  pg_temp.refeicao('e2', 'Almoço', '12:30', array[
    pg_temp.item(pg_temp.op('Arroz, integral, cozido', 'colher de servir', 2, 90), pg_temp.op('Batata, doce, cozida', 'pedaço', 1, 120)),
    pg_temp.item(pg_temp.op('Feijão, carioca, cozido', 'concha', 1, 86)),
    pg_temp.item(pg_temp.op('Frango, peito, sem pele, grelhado', 'filé médio', 1, 120)),
    pg_temp.item(pg_temp.op('Alface, crespa, crua', 'g', 60, 60)),
    pg_temp.item(pg_temp.op('Tomate, com semente, cru', 'g', 80, 80))], 'Prato colorido: metade do prato com salada.'),
  pg_temp.refeicao('e3', 'Lanche da tarde', '16:00', array[
    pg_temp.item(pg_temp.op('Iogurte, natural', 'pote', 1, 170)),
    pg_temp.item(pg_temp.op('Aveia, flocos, crua', 'colher de sopa', 2, 30))]),
  pg_temp.refeicao('e4', 'Jantar', '19:30', array[
    pg_temp.item(pg_temp.rec('Omelete de legumes', 1)),
    pg_temp.item(pg_temp.op('Abobrinha, italiana, refogada', 'g', 100, 100))])
));

insert into public.lista_compras_marcados (perfil_id, cardapio_id, item)
select 'aaaaaaaa-0000-0000-0000-000000000040', c.id, i
from public.cardapios c, unnest(array['Feijão, carioca, cozido', 'Mamão, Formosa, cru']) i where c.objetivo = 'Emagrecimento';

insert into public.lives (tema, data, profissional, duracao_minutos, link_url, gravacao_url, publicado) values
  ('Rótulos sem mistério', pg_temp.quando(12, 19), 'ana', 60, 'https://meet.google.com/demo-ora-1', 'https://drive.google.com/file/d/demoORAlive/view', true),
  ('Sono e fome', least(now() + interval '25 minutes', (public.hoje_brasilia() + 1)::timestamp at time zone 'America/Sao_Paulo' - interval '61 minutes'),
   'clara', 60, 'https://meet.google.com/demo-ora-2', null, true),
  ('Treino em casa sem equipamento', pg_temp.quando(-14, 19), 'lais', 60, null, null, true);

insert into public.aula_materiais (aula_id, tipo, caminho, nome, ordem)
select a.id, 'link', 'https://www.gov.br/saude/pt-br/assuntos/saude-brasil/eu-quero-me-alimentar-melhor', 'Guia alimentar (site do Ministério da Saúde)', 0
from public.aulas a join public.etapas e on e.id = a.etapa_id join public.temas t on t.id = e.tema_id
where t.chave = 'emagrecimento' and e.chave = 'arrancada' and a.dia_liberacao = 1;
