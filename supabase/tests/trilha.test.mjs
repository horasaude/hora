import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ALUNA = ID(2)
const OUTRA = ID(3)
const SEM_ACESSO = ID(4)
const P1 = ID(31)
const P5 = ID(35)
const A = [ID(41), ID(42), ID(43), ID(44), ID(45)]
const C1 = ID(51)
const tema = (chave) => `(select id from public.temas where chave = '${chave}')`
const etapa = (tema_, chave) =>
  `(select e.id from public.etapas e join public.temas t on t.id = e.tema_id where t.chave = '${tema_}' and e.chave = '${chave}')`
const diaAtras = (n) =>
  `(public.hoje_brasilia() - ${n})::timestamp at time zone 'America/Sao_Paulo'`
const soma = `select coalesce(sum(pontos), 0)::int from public.lancamentos_pontos where perfil_id = '${ALUNA}'`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'a@t.com'),($2,'o@t.com'),($3,'s@t.com')`,
    [ALUNA, OUTRA, SEM_ACESSO],
  )
  await db.exec(`
    update public.perfis set acesso_inicio_em = ${diaAtras(9)} where id = '${ALUNA}';
    update public.perfis set acesso_inicio_em = ${diaAtras(2)} where id = '${OUTRA}';
    insert into public.aulas (id, etapa_id, titulo, video_url, dia_liberacao, publicado) values
      ('${P1}', ${etapa('preparacao', 'preparacao')}, 'Boas-vindas', 'https://v.t/p1', 1, true),
      ('${P5}', ${etapa('preparacao', 'preparacao')}, 'Dia 5', 'https://v.t/p5', 5, true),
      ('${A[0]}', ${etapa('emagrecimento', 'arrancada')}, 'A1', 'https://v.t/a1', 1, true),
      ('${A[1]}', ${etapa('emagrecimento', 'arrancada')}, 'A2', 'https://v.t/a2', 1, true),
      ('${A[2]}', ${etapa('emagrecimento', 'arrancada')}, 'A3', 'https://v.t/a3', 1, true),
      ('${A[3]}', ${etapa('emagrecimento', 'arrancada')}, 'A4', 'https://v.t/a4', 1, true),
      ('${A[4]}', ${etapa('emagrecimento', 'arrancada')}, 'A5', 'https://v.t/a5', 5, true),
      ('${C1}', ${etapa('emagrecimento', 'constancia')}, 'C1', 'https://v.t/c1', 1, true);
  `)
}

const ver = (id) => `select count(*)::int from public.aulas where id = '${id}'`
const trilha = (caminho) => `select public.trilha_aluna() #>> '{${caminho}}'`

async function preparacao(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(OUTRA)
  await esperaValor('dia 3 da aluna nova', trilha('dia'), '3')
  await esperaValor('aula do dia 1 da preparação abre', ver(P1), 1)
  await esperaValor('aula bloqueada não devolve vídeo nem linha', ver(P5), 0)
  await esperaValor(
    'trilha lista a aula bloqueada sem vídeo',
    `select (public.trilha_aluna() -> 'preparacao' -> 1) ? 'video_url'`,
    false,
  )
  await esperaValor(
    'trilha marca a aula do dia 5 como fechada',
    trilha('preparacao,1,liberada'),
    'false',
  )
  await esperaErro(
    'tema só pode ser escolhido a partir do dia 8',
    `select public.escolher_tema(${tema('emagrecimento')})`,
    '22023',
  )
}

async function escolha(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor('sem tema escolhido ainda', trilha('tema_atual'), null)
  await esperaValor(
    'cinco temas para escolher',
    `select jsonb_array_length(public.trilha_aluna() -> 'temas')`,
    5,
  )
  await esperaErro(
    'preparação não é tema escolhível',
    `select public.escolher_tema(${tema('preparacao')})`,
    '22023',
  )
  await esperaValor(
    'escolhe Emagrecimento no dia 10',
    `select count(*)::int from (select public.escolher_tema(${tema('emagrecimento')})) x`,
    1,
  )
  await esperaValor('Arrancada começa hoje', trilha('etapas,0,dia_na_etapa'), '1')
  await esperaValor('Constância ainda bloqueada', trilha('etapas,1,iniciada_em'), null)
  await esperaValor('aula do dia 1 da etapa abre', ver(A[0]), 1)
  await esperaValor('aula do dia 5 da etapa fica fechada', ver(A[4]), 0)
  await esperaValor('aula da etapa bloqueada fica fechada', ver(C1), 0)
}

async function avancar(t) {
  const { esperaValor, db } = t
  await t.comoAluna(ALUNA)
  for (const id of A.slice(0, 4))
    await db.query(`insert into public.aulas_concluidas (aula_id) values ('${id}')`)
  await esperaValor('80% das aulas sem 30 dias não avança', trilha('etapas,1,iniciada_em'), null)
  await esperaValor('quatro aulas dão 40 pontos', soma, 40)
  await db.query(`delete from public.aulas_concluidas where aula_id = '${A[0]}'`)
  await db.query(`insert into public.aulas_concluidas (aula_id) values ('${A[0]}')`)
  await esperaValor('desmarcar e marcar de novo não pontua duas vezes', soma, 40)
  await t.comoDono()
  await db.query(
    `update public.etapas_iniciadas set iniciada_em = public.hoje_brasilia() - 29 where perfil_id = '${ALUNA}'`,
  )
  await db.query(`delete from public.aulas_concluidas where aula_id = '${A[3]}'`)
  await t.comoAluna(ALUNA)
  await esperaValor('30 dias com 60% das aulas não avança', trilha('etapas,1,iniciada_em'), null)
  await db.query(`insert into public.aulas_concluidas (aula_id) values ('${A[3]}')`)
  await esperaValor('80% e 30 dias abrem a Constância', trilha('etapas,1,dia_na_etapa'), '1')
  await esperaValor('aula da Constância abre', ver(C1), 1)
  await esperaValor('aula do dia 5 da Arrancada abriu no dia 30', ver(A[4]), 1)
}

async function trocar(t) {
  const { esperaValor } = t
  await t.comoAluna(ALUNA)
  await t.db.query(`select public.escolher_tema(${tema('lipedema')})`)
  await esperaValor(
    'trocou para Lipedema',
    `select tema_atual_id = ${tema('lipedema')} from public.perfis where id = '${ALUNA}'`,
    true,
  )
  await esperaValor('Lipedema começa na Arrancada', trilha('etapas,0,dia_na_etapa'), '1')
  await t.db.query(`select public.escolher_tema(${tema('emagrecimento')})`)
  await esperaValor(
    'voltando ao tema, continua na Constância',
    trilha('etapas,1,dia_na_etapa'),
    '1',
  )
  await esperaValor('progresso do tema guardado', trilha('etapas,0,aulas,0,concluida'), 'true')
}

async function isolamento(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(OUTRA)
  await esperaValor(
    'outra aluna não vê as etapas dela',
    `select count(*)::int from public.etapas_iniciadas`,
    0,
  )
  await esperaValor(
    'outra aluna não vê as conclusões dela',
    `select count(*)::int from public.aulas_concluidas`,
    0,
  )
  await esperaErro(
    'aluna não inicia etapa por fora',
    `insert into public.etapas_iniciadas (perfil_id, etapa_id) values ('${OUTRA}', ${etapa('emagrecimento', 'manutencao')})`,
    '42501',
  )
  await esperaErro(
    'aluna não muda o próprio tema direto',
    `update public.perfis set tema_atual_id = ${tema('menopausa')} where id = '${OUTRA}'`,
    '42501',
  )
  await t.comoAluna(SEM_ACESSO)
  await esperaValor('sem acesso, trilha sem dia', trilha('dia'), null)
  await esperaValor('sem acesso, não vê aula', ver(P1), 0)
  await t.comoAnon()
  await esperaErro('anônimo não usa trilha_aluna', `select public.trilha_aluna()`, '42501')
}

export async function testarTrilha() {
  const t = await criarBanco()
  await montar(t.db)
  await preparacao(t)
  await escolha(t)
  await avancar(t)
  await trocar(t)
  await isolamento(t)
  return t.fim('trilha')
}
