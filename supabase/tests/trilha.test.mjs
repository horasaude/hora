import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ALUNA = ID(2)
const NOVA = ID(3)
const SEM_ACESSO = ID(4)
const D1 = ID(31)
const E1 = ID(41)
const C1 = ID(51)
const tema = (chave) => `(select id from public.temas where chave = '${chave}')`
const etapaDe = (chave) => `(select e.id from public.etapas e where e.tema_id = ${tema(chave)})`
const diaAtras = (n) =>
  `(public.hoje_brasilia() - ${n})::timestamp at time zone 'America/Sao_Paulo'`
const ver = (id) => `select count(*)::int from public.aulas where id = '${id}'`
const trilha = (caminho) => `select public.trilha_aluna() #>> '{${caminho}}'`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'a@t.com'),($2,'n@t.com'),($3,'s@t.com')`,
    [ALUNA, NOVA, SEM_ACESSO],
  )
  await db.exec(`
    update public.temas set publicado = true;
    update public.perfis set acesso_inicio_em = ${diaAtras(9)} where id = '${ALUNA}';
    update public.perfis set acesso_inicio_em = ${diaAtras(2)} where id = '${NOVA}';
    insert into public.aulas (id, etapa_id, titulo, video_url, dia_liberacao, publicado) values
      ('${D1}', ${etapaDe('preparacao')}, 'Boas-vindas ao Detox', 'https://youtu.be/d1aaaaaaaaa', 1, true),
      ('${E1}', ${etapaDe('emagrecimento')}, 'Emagrecer 1', 'https://v.t/e1', 1, true),
      ('${C1}', ${etapaDe('composicao')}, 'Composição 1', 'https://v.t/c1', 1, true);
  `)
}

async function sequencia(t) {
  const { esperaValor } = t
  await esperaValor(
    'Detox é o primeiro tema, por 7 dias',
    `select titulo || ':' || dias_liberado from public.temas order by ordem limit 1`,
    'Detox:7',
  )
  await esperaValor(
    'cada tema tem uma etapa só',
    `select count(*)::int from public.etapas group by tema_id order by 1 desc limit 1`,
    1,
  )
  await esperaValor(
    'o segundo tema abre no dia 8',
    `select public.inicio_do_tema(${tema('emagrecimento')})`,
    8,
  )
  await esperaValor(
    'o terceiro abre 30 dias depois, no dia 38',
    `select public.inicio_do_tema(${tema('composicao')})`,
    38,
  )
  await t.comoAluna(NOVA)
  await esperaValor('dia 3 da aluna nova', trilha('dia'), '3')
  await esperaValor('dia 3: Detox aberto', trilha('temas,0,aberto'), 'true')
  await esperaValor('dia 3: segundo tema fechado', trilha('temas,1,aberto'), 'false')
  await esperaValor('aula do Detox abre', ver(D1), 1)
  await esperaValor(
    'aula aberta traz a imagem do vídeo; a fechada não',
    `select (public.trilha_aluna() #>> '{temas,0,aulas,0,miniatura}') || '|' || coalesce(public.trilha_aluna() #>> '{temas,1,aulas,0,miniatura}', 'nada')`,
    'https://i.ytimg.com/vi/d1aaaaaaaaa/hqdefault.jpg|nada',
  )
  await esperaValor('aula do tema fechado não devolve vídeo nem linha', ver(E1), 0)
  await esperaValor(
    'a lista mostra a aula fechada sem vídeo',
    `select (public.trilha_aluna() -> 'temas' -> 1 -> 'aulas' -> 0) ? 'video_url'`,
    false,
  )
  await t.comoAluna(ALUNA)
  await esperaValor('dia 10: segundo tema aberto', trilha('temas,1,aberto'), 'true')
  await esperaValor('o Detox continua aberto para rever', ver(D1), 1)
  await esperaValor('aula do segundo tema abre inteira', ver(E1), 1)
  await esperaValor('o terceiro tema ainda fechado', ver(C1), 0)
}

async function ajustes(t) {
  const { esperaValor, esperaErro } = t
  await t.comoDono()
  await t.db.query(`update public.temas set dias_liberado = 2 where id = ${tema('emagrecimento')}`)
  await t.comoAluna(ALUNA)
  await esperaValor('mudar a duração do tema puxa o próximo', ver(C1), 1)
  await t.comoDono()
  await t.db.query(`update public.temas set dias_liberado = 30 where id = ${tema('emagrecimento')}`)
  await t.db.query(`update public.temas set dias_liberado = 0 where id = ${tema('preparacao')}`)
  await esperaValor(
    'tema com 0 dias abre junto com o próximo',
    `select public.inicio_do_tema(${tema('emagrecimento')})`,
    1,
  )
  await t.db.query(`update public.temas set dias_liberado = 7 where id = ${tema('preparacao')}`)
  await t.db.query(`update public.temas set bloqueado = true where id = ${tema('emagrecimento')}`)
  await t.comoAluna(ALUNA)
  await esperaValor('tema Em breve fecha as aulas, mesmo no dia certo', ver(E1), 0)
  await esperaValor('a trilha marca Em breve', trilha('temas,1,em_breve'), 'true')
  await esperaErro(
    'a escolha de tema não existe mais',
    `select public.escolher_tema(${tema('menopausa')})`,
    '22023',
  )
}

async function doTema(t) {
  const { esperaValor, esperaErro } = t
  const DES = ID(61)
  await t.comoDono()
  await t.db.exec(`
    insert into public.desafios (id, nome, inicio, fim, tipo_checkin, meta_dias, pontos_por_dia, bonus_conclusao, publicado, tema_id)
      values ('${DES}', 'Desafio do Detox', '2026-01-01', '2099-12-31', 'sim_nao', 5, 10, 0, true, ${tema('preparacao')});
    insert into public.tema_materiais (tema_id, tipo, caminho, nome) values
      (${tema('preparacao')}, 'pdf', 'temas/detox.pdf', 'Guia do Detox'),
      (${tema('composicao')}, 'pdf', 'temas/comp.pdf', 'Guia da composição');
  `)
  await t.comoAluna(NOVA)
  await esperaValor(
    'no Detox, o desafio do tema vale do dia 1 ao 7 dela',
    `select (fim - inicio + 1)::int from public.meus_desafios() where id = '${DES}'`,
    7,
  )
  await esperaValor(
    'check-in no desafio do tema dentro da janela',
    `select count(*)::int from (select public.checkin_desafio('${DES}')) x`,
    1,
  )
  await esperaValor(
    'vê só os materiais dos temas abertos',
    `select string_agg(nome, ',') from public.tema_materiais`,
    'Guia do Detox',
  )
  await t.comoAluna(ALUNA)
  await esperaErro(
    'depois dos 7 dias dela, o desafio do Detox fecha',
    `select public.checkin_desafio('${DES}')`,
    '22023',
  )
}

async function isolamento(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(NOVA)
  await esperaValor(
    'outra aluna não vê as conclusões dela',
    `select count(*)::int from public.aulas_concluidas`,
    0,
  )
  await esperaErro(
    'aluna não muda o próprio tema direto',
    `update public.perfis set tema_atual_id = ${tema('menopausa')} where id = '${NOVA}'`,
    '42501',
  )
  await t.comoAluna(SEM_ACESSO)
  await esperaValor('sem acesso, trilha sem dia', trilha('dia'), null)
  await esperaValor('sem acesso, não vê aula', ver(D1), 0)
  await t.comoAnon()
  await esperaErro('anônimo não usa trilha_aluna', `select public.trilha_aluna()`, '42501')
}

export async function testarTrilha() {
  const t = await criarBanco()
  await montar(t.db)
  await sequencia(t)
  await ajustes(t)
  await doTema(t)
  await isolamento(t)
  return t.fim('trilha')
}
