import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const SEM_ACESSO = ID(3)
const AULA = ID(41)
const prepTema = `(select id from public.temas where chave = 'preparacao')`
const prep = `(select e.id from public.etapas e where e.tema_id = ${prepTema})`
const ema = `(select id from public.temas where chave = 'emagrecimento')`
const liberada = `select public.aula_liberada('${AULA}')`
const emBreve = `select (public.aulas_da_etapa(${prep}) -> 0 ->> 'em_breve')::boolean`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'s@t.com')`,
    [ADMIN, ALUNA, SEM_ACESSO],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = (public.hoje_brasilia() - 9)::timestamp at time zone 'America/Sao_Paulo' where id = '${ALUNA}';
    update public.temas set publicado = true;
    update public.etapas set publicado = true;
    insert into public.aulas (id, etapa_id, titulo, video_url, dia_liberacao, publicado) values
      ('${AULA}', ${prep}, 'Dia 1', 'https://v.t/1', 1, true);
  `)
}

async function aulas(t) {
  const { esperaValor } = t
  const mudar = async (sql, tabela = 'aulas', id = `'${AULA}'`) => {
    await t.comoDono()
    await t.db.query(`update public.${tabela} set ${sql} where id = ${id}`)
    await t.comoAluna(ALUNA)
  }
  await t.comoAluna(ALUNA)
  await esperaValor('aula aberta e no dia: liberada', liberada, true)
  await mudar('bloqueado = true')
  await esperaValor('Em breve: fechada', liberada, false)
  await esperaValor('Em breve: a lista avisa', emBreve, true)
  await esperaValor('Em breve: a aluna não lê a aula', `select count(*)::int from public.aulas`, 0)
  await mudar(`bloqueado = false, libera_em = now() + interval '1 day'`)
  await esperaValor('data futura: fechada', liberada, false)
  await mudar(`libera_em = now() - interval '1 minute'`)
  await esperaValor('data passada: liberada', liberada, true)
  await esperaValor('data passada: sem Em breve', emBreve, false)
  await mudar('bloqueado = true', 'temas', prepTema)
  await esperaValor('tema Em breve fecha as aulas dele', liberada, false)
  await mudar('bloqueado = false', 'temas', prepTema)
}

async function temas(t) {
  const { esperaValor, esperaErro } = t
  await t.comoDono()
  await t.db.query(`update public.temas set libera_em = now() + interval '2 days' where id = ${ema}`)
  await t.comoAluna(ALUNA)
  await esperaValor(
    'trilha marca o tema Em breve',
    `select (select x ->> 'em_breve' from jsonb_array_elements(public.trilha_aluna() -> 'temas') x where x ->> 'id' = ${ema}::text)::boolean`,
    true,
  )
  await esperaErro('tema Em breve não pode ser escolhido', `select public.escolher_tema(${ema})`, '22023')
  await t.comoDono()
  await t.db.query(`update public.temas set libera_em = null where id = ${ema}`)
  await t.comoAluna(ALUNA)
  await esperaValor(
    'tema liberado pode ser escolhido',
    `select count(*)::int from (select public.escolher_tema(${ema})) x`,
    1,
  )
}

async function ordem(t) {
  const { esperaValor, esperaErro } = t
  const ids = `(select array_agg(id order by ordem desc) from public.temas)`
  await t.comoAluna(ALUNA)
  await esperaErro('aluna não muda a ordem', `select public.ordenar_temas(${ids})`, '42501')
  await t.comoAluna(ADMIN)
  await esperaErro(
    'lista incompleta é recusada',
    `select public.ordenar_temas((select array_agg(id) from (select id from public.temas limit 1) x))`,
    '22023',
  )
  const ultimo = await t.db.query(`select id from public.temas order by ordem desc limit 1`)
  await t.db.query(`select public.ordenar_temas(${ids})`)
  await esperaValor(
    'o último tema vira o primeiro',
    `select id::text from public.temas order by ordem limit 1`,
    ultimo.rows[0].id,
  )
}

async function comece(t) {
  const { esperaValor, esperaErro } = t
  const itens = `[{"tipo":"pdf","caminho":"comece/guia.pdf","nome":"Guia","tamanho":900},{"tipo":"word","caminho":"comece/lista.docx","nome":"Lista","tamanho":500}]`
  await t.comoAluna(ADMIN)
  await t.db.query(`select public.salvar_materiais_comece('${itens}'::jsonb)`)
  await esperaValor(
    'equipe salva na ordem',
    `select string_agg(nome, ',' order by ordem) from public.comece_materiais`,
    'Guia,Lista',
  )
  await esperaErro(
    'caminho fora de comece/ é recusado',
    `select public.salvar_materiais_comece('[{"tipo":"pdf","caminho":"aulas/x.pdf","nome":"X"}]'::jsonb)`,
    '23514',
  )
  await t.comoAluna(ALUNA)
  await esperaValor('aluna com acesso lê', `select count(*)::int from public.comece_materiais`, 2)
  await esperaErro(
    'aluna não salva',
    `select public.salvar_materiais_comece('[]'::jsonb)`,
    '42501',
  )
  await t.comoAluna(SEM_ACESSO)
  await esperaValor('sem acesso não lê', `select count(*)::int from public.comece_materiais`, 0)
}

export async function testarLiberacao() {
  const t = await criarBanco()
  await montar(t.db)
  await aulas(t)
  await temas(t)
  await ordem(t)
  await comece(t)
  return t.fim('liberação de tema e aula, ordem dos temas e arquivos do Comece')
}
