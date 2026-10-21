import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const NOVA = ID(3)
const SEM_ACESSO = ID(4)
const [PUB, RASC, OUTRO, PREP] = [ID(61), ID(62), ID(63), ID(64)]
const ROTINA = ID(71)
const tema = (c) => `(select id from public.temas where chave = '${c}')`
const ex = (nome) => `(select id from public.exercicios where nome = '${nome}')`
const soma = `select coalesce(sum(pontos), 0)::int from public.lancamentos_pontos where perfil_id = '${ALUNA}'`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'n@t.com'),($4,'s@t.com')`,
    [ADMIN, ALUNA, NOVA, SEM_ACESSO],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.temas set publicado = true;
    update public.perfis set acesso_inicio_em = now() - interval '10 days' where id = '${ALUNA}';
    update public.perfis set acesso_inicio_em = now() - interval '2 days' where id = '${NOVA}';
    insert into public.treinos (id, nome, tema_id, nivel, local, publicado) values
      ('${PUB}', 'Treino A', ${tema('emagrecimento')}, 'iniciante', 'casa', true),
      ('${RASC}', 'Treino B rascunho', ${tema('emagrecimento')}, 'iniciante', 'casa', false),
      ('${OUTRO}', 'Treino de outro tema', ${tema('lipedema')}, 'iniciante', 'casa', true),
      ('${PREP}', 'Treino da preparação', ${tema('preparacao')}, 'iniciante', 'casa', true);
    insert into public.treino_exercicios (treino_id, exercicio_id) values
      ('${PUB}', ${ex('Agachamento livre')}), ('${RASC}', ${ex('Prancha frontal')}), ('${OUTRO}', ${ex('Polichinelo')});
    insert into public.rotinas (id, nome, tema_id, nivel, local, publicado) values
      ('${ROTINA}', 'Iniciante em casa', ${tema('emagrecimento')}, 'iniciante', 'casa', true);
    insert into public.rotina_treinos (rotina_id, treino_id, dia_semana) values ('${ROTINA}', '${PUB}', 1), ('${ROTINA}', '${RASC}', 3);
  `)
}

const nomes = (tabela) =>
  `select coalesce(string_agg(nome, ',' order by nome), '') from public.${tabela}`

async function visibilidade(t) {
  const { esperaValor } = t
  await t.comoAluna(ALUNA)
  await esperaValor(
    'dia 11: vê os treinos publicados do Detox e do segundo tema',
    nomes('treinos'),
    'Treino A,Treino da preparação',
  )
  await esperaValor(
    'rascunho não aparece nem pela rotina',
    `select count(*)::int from public.rotina_treinos`,
    1,
  )
  await esperaValor('vê só o exercício dos treinos dela', nomes('exercicios'), 'Agachamento livre')
  await esperaValor('vê a rotina publicada do tema', nomes('rotinas'), 'Iniciante em casa')
  await t.comoAluna(NOVA)
  await esperaValor('no Detox, vê só o treino do Detox', nomes('treinos'), 'Treino da preparação')
  await esperaValor('no Detox, não vê rotina de tema fechado', nomes('rotinas'), '')
  await t.comoAluna(SEM_ACESSO)
  await esperaValor('sem acesso, não vê treino', nomes('treinos'), '')
  await esperaValor('sem acesso, não vê exercício', nomes('exercicios'), '')
  await t.comoAnon()
  await t.esperaErro('anônimo não lê treinos', `select * from public.treinos`, '42501')
  await t.comoAluna(ADMIN)
  await esperaValor('admin vê os 4 treinos', `select count(*)::int from public.treinos`, 4)
  await esperaValor(
    'exercícios básicos cadastrados',
    `select (count(*) >= 30)::text from public.exercicios`,
    'true',
  )
}

async function feitos(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor(
    'registra o treino feito',
    `insert into public.treinos_feitos (treino_id, series, concluido_em) values ('${PUB}', '{"0": 3}', now()) returning 1`,
    1,
  )
  await esperaErro(
    'não registra treino de outro tema',
    `insert into public.treinos_feitos (treino_id) values ('${OUTRO}')`,
    '42501',
  )
  await esperaErro(
    'não registra treino em rascunho',
    `insert into public.treinos_feitos (treino_id) values ('${RASC}')`,
    '42501',
  )
  await esperaErro(
    'não registra em nome de outra',
    `insert into public.treinos_feitos (perfil_id, treino_id) values ('${NOVA}', '${PUB}')`,
    '42501',
  )
  await esperaValor(
    'aluna não edita treino',
    `with u as (update public.treinos set nome = 'x' where id = '${PUB}' returning 1) select count(*)::int from u`,
    0,
  )
  await t.comoAluna(NOVA)
  await esperaValor(
    'outra aluna não vê os treinos feitos dela',
    `select count(*)::int from public.treinos_feitos`,
    0,
  )
  await t.comoAluna(ALUNA)
  const checkin = `select pontos from public.fazer_checkin('treino', '${ALUNA}/treino.jpg', 'musculacao', 40)`
  await esperaValor('check-in de treino com foto dá 10 pontos', checkin, 10)
  await esperaValor('o mesmo check-in de novo não pontua', checkin, 0)
  await esperaValor('os pontos não duplicam', soma, 10)
}

async function painel(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ADMIN)
  await t.db.query(`select public.salvar_treino(
    jsonb_build_object('nome', 'Treino C', 'tema_id', ${tema('preparacao')}, 'nivel', 'iniciante', 'local', 'casa'),
    jsonb_build_array(jsonb_build_object('exercicio_id', ${ex('Polichinelo')}), jsonb_build_object('exercicio_id', ${ex('Prancha frontal')})))`)
  await esperaValor(
    'admin salva treino com exercícios em ordem',
    `select string_agg(e.nome, ',' order by te.ordem) from public.treinos tr
     join public.treino_exercicios te on te.treino_id = tr.id join public.exercicios e on e.id = te.exercicio_id
     where tr.nome = 'Treino C'`,
    'Polichinelo,Prancha frontal',
  )
  await esperaValor('resumo do painel', `select (public.resumo_treinos() ->> 'feitos_7_dias')`, '1')
  await t.comoAluna(ALUNA)
  await esperaErro(
    'aluna não salva treino',
    `select public.salvar_treino('{"nome": "x"}'::jsonb, '[]'::jsonb)`,
    '42501',
  )
}

async function estiloMfit(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ADMIN)
  await t.db.query(`select public.salvar_treino(
    jsonb_build_object('nome', 'Treino D', 'tema_id', ${tema('emagrecimento')}, 'nivel', 'adaptacao', 'local', 'casa',
      'publicado', true, 'orientacoes', 'Beba água'),
    jsonb_build_array(jsonb_build_object('exercicio_id', ${ex('Agachamento livre')}, 'alternativo_id', ${ex('Leg press 45')},
      'series_detalhe', '[{"repeticoes":"15","carga":"","descanso_segundos":30},{"repeticoes":"12","carga":"5 kg","descanso_segundos":45},{"repeticoes":"10","carga":"8 kg","descanso_segundos":60}]'::jsonb)))`)
  await esperaValor(
    'série por série grava as 3 linhas e conta as séries',
    `select te.series || ':' || (te.series_detalhe -> 1 ->> 'carga') from public.treino_exercicios te
     join public.treinos tr on tr.id = te.treino_id where tr.nome = 'Treino D'`,
    '3:5 kg',
  )
  await esperaValor(
    'nível Adaptação e orientações',
    `select nivel || ':' || orientacoes from public.treinos where nome = 'Treino D'`,
    'adaptacao:Beba água',
  )
  await esperaErro(
    'série sem repetição é recusada',
    `select public.salvar_treino(jsonb_build_object('nome', 'Treino E', 'tema_id', ${tema('emagrecimento')}, 'nivel', 'iniciante', 'local', 'casa'),
      jsonb_build_array(jsonb_build_object('exercicio_id', ${ex('Polichinelo')}, 'series_detalhe', '[{"repeticoes":"","descanso_segundos":30}]'::jsonb)))`,
    '23514',
  )
  await t.db.query(`select public.salvar_rotina(
    jsonb_build_object('nome', 'ABC', 'tema_id', ${tema('emagrecimento')}, 'nivel', 'adaptacao', 'local', 'casa', 'tipo', 'numerico',
      'objetivo', 'qualidade_vida', 'orientacoes', 'Treine 3x', 'publicado', true),
    jsonb_build_array(jsonb_build_object('treino_id', (select id from public.treinos where nome = 'Treino D')),
      jsonb_build_object('treino_id', '${PUB}')))`)
  await esperaValor(
    'rotina numérica guarda a ordem, sem dia da semana',
    `select string_agg(tr.nome || '#' || rt.ordem, ',' order by rt.ordem) from public.rotina_treinos rt
     join public.rotinas r on r.id = rt.rotina_id join public.treinos tr on tr.id = rt.treino_id
     where r.nome = 'ABC' and rt.dia_semana is null`,
    'Treino D#0,Treino A#1',
  )
  await t.db.query(
    `insert into public.exercicios_favoritos (exercicio_id) values (${ex('Polichinelo')})`,
  )
  await esperaValor(
    'admin marca favorito',
    `select count(*)::int from public.exercicios_favoritos`,
    1,
  )
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna lê o exercício alternativo do treino dela',
    `select count(*)::int from public.exercicios where nome = 'Leg press 45'`,
    1,
  )
  await esperaValor(
    'aluna não vê favoritos',
    `select count(*)::int from public.exercicios_favoritos`,
    0,
  )
  await esperaErro(
    'aluna não marca favorito',
    `insert into public.exercicios_favoritos (exercicio_id) values (${ex('Polichinelo')})`,
    '42501',
  )
  await esperaValor(
    'aluna escolhe o nível Adaptação',
    `with u as (update public.perfis set treino_nivel = 'adaptacao' where id = '${ALUNA}' returning 1) select count(*)::int from u`,
    1,
  )
}

async function aerobico(t) {
  const { esperaValor } = t
  await t.comoAluna(ADMIN)
  await t.db.query(`select public.salvar_treino(
    jsonb_build_object('nome', 'Bike leve', 'tema_id', ${tema('emagrecimento')}, 'nivel', 'iniciante', 'local', 'academia',
      'categoria', 'aerobico', 'publicado', true),
    jsonb_build_array(jsonb_build_object('exercicio_id', ${ex('Bicicleta ergométrica')}, 'series', 1, 'repeticoes', '20 min', 'carga', 'Moderada')))`)
  await esperaValor(
    'treino aeróbico guarda o tipo',
    `select categoria from public.treinos where nome = 'Bike leve'`,
    'aerobico',
  )
  await esperaValor(
    'treino sem tipo é musculação',
    `select categoria from public.treinos where nome = 'Treino A'`,
    'musculacao',
  )
  await esperaValor(
    'modalidades de cardio na biblioteca',
    `select (count(*) >= 10)::text from public.exercicios where grupo = 'cardio'`,
    'true',
  )
}

async function combinados(t) {
  const { esperaValor } = t
  await t.comoAluna(ADMIN)
  await t.db.query(`select public.salvar_treino(
    jsonb_build_object('nome', 'Bi-set', 'tema_id', ${tema('emagrecimento')}, 'nivel', 'iniciante', 'local', 'casa'),
    jsonb_build_array(jsonb_build_object('exercicio_id', ${ex('Polichinelo')}, 'combinado', 1),
      jsonb_build_object('exercicio_id', ${ex('Prancha frontal')}, 'combinado', 1),
      jsonb_build_object('exercicio_id', ${ex('Agachamento livre')})))`)
  await esperaValor(
    'exercícios combinados guardam o grupo',
    `select string_agg(coalesce(te.combinado::text, '-'), ',' order by te.ordem) from public.treino_exercicios te
     join public.treinos tr on tr.id = te.treino_id where tr.nome = 'Bi-set'`,
    '1,1,-',
  )
}

export async function testarTreinos() {
  const t = await criarBanco()
  await montar(t.db)
  await visibilidade(t)
  await feitos(t)
  await painel(t)
  await estiloMfit(t)
  await aerobico(t)
  await combinados(t)
  return t.fim('treinos')
}
