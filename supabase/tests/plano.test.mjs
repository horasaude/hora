import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const SEM_ACESSO = ID(3)

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'s@t.com')`,
    [ADMIN, ALUNA, SEM_ACESSO],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '1 day' where id = '${ALUNA}';
    insert into public.receitas (id, nome, publicado, foto_path) values ('${ID(21)}', 'Omelete', true, 'r/omelete.jpg'), ('${ID(22)}', 'Bolo rascunho', false, 'r/bolo.jpg');
    insert into public.cardapios (titulo, objetivo, publicado) values ('Leve', 'Emagrecimento', true), ('Rascunho', 'Lipedema', false);
    insert into public.refeicoes_modelo (nome, tipo) values ('Café proteico', 'cafe');
    insert into storage.objects (bucket_id, name) values ('receitas', 'r/omelete.jpg'), ('receitas', 'r/bolo.jpg');
  `)
}

async function taco(t) {
  const { esperaValor, esperaErro } = t
  await t.comoDono()
  await esperaValor(
    'TACO tem os 597 alimentos da 4ª edição',
    `select count(*)::int from public.alimentos where origem = 'taco'`,
    597,
  )
  await esperaValor(
    'arroz integral cozido com o valor oficial',
    `select kcal::text from public.alimentos where codigo_taco = 1`,
    '123.53',
  )
  await esperaValor(
    'busca ignora acento',
    `select count(*)::int from public.alimentos where busca like '%feijao%'`,
    (
      await t.db.query(
        `select count(*)::int as n from public.alimentos where nome ilike '%feijão%'`,
      )
    ).rows[0].n,
  )
  await t.comoAluna(ADMIN)
  await esperaValor(
    'admin não altera alimento da TACO',
    `with u as (update public.alimentos set kcal = 1 where codigo_taco = 1 returning 1) select count(*)::int from u`,
    0,
  )
  await esperaValor(
    'admin não remove alimento da TACO',
    `with u as (delete from public.alimentos where codigo_taco = 1 returning 1) select count(*)::int from u`,
    0,
  )
  await esperaErro(
    'admin não cria alimento como TACO',
    `insert into public.alimentos (origem, codigo_taco, nome) values ('taco', 9999, 'x')`,
    '42501',
  )
  await esperaErro(
    'salvar_alimento não altera TACO',
    `select public.salvar_alimento(jsonb_build_object('id', (select id from public.alimentos where codigo_taco = 1), 'nome', 'x'), '[]')`,
    '42501',
  )
}

async function alimentosProprios(t) {
  const { esperaValor, db } = t
  await t.comoAluna(ADMIN)
  const r = await db.query(
    `select public.salvar_alimento('{"nome":"Pão de queijo da casa","grupo":"Cereais e derivados","kcal":"300","proteina":"6","carboidrato":"35","gordura":"15","fibra":"1"}', '[{"nome":"1 unidade","gramas":"50"},{"nome":"1 colher de sopa","gramas":"22"}]') as id`,
  )
  const id = r.rows[0].id
  await esperaValor(
    'alimento próprio criado com duas medidas caseiras',
    `select count(*)::int from public.medidas_caseiras where alimento_id = '${id}'`,
    2,
  )
  await db.query(
    `select public.salvar_alimento('{"id":"${id}","nome":"Pão de queijo","grupo":"","kcal":"310"}', '[{"nome":"1 unidade","gramas":"50"}]')`,
  )
  await esperaValor(
    'editar troca as medidas',
    `select count(*)::int from public.medidas_caseiras where alimento_id = '${id}'`,
    1,
  )
  const copia = (await db.query(`select public.duplicar_alimento('${id}') as id`)).rows[0].id
  await esperaValor(
    'duplicar copia alimento e medidas',
    `select count(*)::int from public.medidas_caseiras where alimento_id = '${copia}'`,
    1,
  )
  await esperaValor(
    'cópia fica marcada no nome',
    `select count(*)::int from public.alimentos where nome = 'Pão de queijo (cópia)'`,
    1,
  )
  const taco1 = (await db.query(`select id from public.alimentos where codigo_taco = 1`)).rows[0].id
  await db.query(
    `select public.salvar_receita_itens('${ID(21)}', '[{"alimento_id":"${taco1}","gramas":"100"},{"alimento_id":"${id}","gramas":"50"}]')`,
  )
  await esperaValor(
    'receita guarda ingredientes da lista de alimentos',
    `select count(*)::int from public.receita_itens where receita_id = '${ID(21)}'`,
    2,
  )
  await t.esperaErro(
    'alimento em uso numa receita não é removido',
    `delete from public.alimentos where id = '${id}'`,
    '23001',
  )
}

async function aluna(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna lê só a receita publicada',
    `select count(*)::int from public.receitas`,
    1,
  )
  await esperaValor(
    'aluna lê os ingredientes da receita publicada',
    `select count(*)::int from public.receita_itens`,
    2,
  )
  await esperaValor(
    'aluna lê só o cardápio publicado',
    `select count(*)::int from public.cardapios`,
    1,
  )
  await esperaValor(
    'aluna não vê refeições modelo',
    `select count(*)::int from public.refeicoes_modelo`,
    0,
  )
  await esperaValor(
    'aluna com acesso lê a lista de alimentos',
    `select (count(*) > 597) from public.alimentos`,
    true,
  )
  await esperaValor(
    'aluna vê só a foto da receita publicada',
    `select count(*)::int from storage.objects`,
    1,
  )
  await esperaErro(
    'aluna não cria alimento',
    `insert into public.alimentos (nome) values ('x')`,
    '42501',
  )
  await esperaErro(
    'aluna não usa salvar_alimento',
    `select public.salvar_alimento('{"nome":"x"}', '[]')`,
    '42501',
  )
  await t.comoAluna(SEM_ACESSO)
  await esperaValor('sem acesso, não vê alimentos', `select count(*)::int from public.alimentos`, 0)
  await esperaValor('sem acesso, não vê receitas', `select count(*)::int from public.receitas`, 0)
  await t.comoAnon()
  await esperaErro('visitante não lê alimentos', `select count(*) from public.alimentos`, '42501')
}

async function formatos(t) {
  await t.comoAluna(ADMIN)
  await t.esperaErro(
    'objetivo fora da lista é recusado',
    `insert into public.cardapios (titulo, objetivo) values ('x', 'Outro')`,
    '23514',
  )
  await t.esperaErro(
    'refeições do cardápio são uma lista',
    `insert into public.cardapios (titulo, objetivo, refeicoes) values ('x', 'Lipedema', '{}')`,
    '23514',
  )
  await t.esperaErro(
    'modelo do cardápio é calculado ou texto',
    `insert into public.cardapios (titulo, objetivo, modelo) values ('x', 'Lipedema', 'outro')`,
    '23514',
  )
}

export async function testarPlano() {
  const t = await criarBanco()
  await montar(t.db)
  await taco(t)
  await alimentosProprios(t)
  await aluna(t)
  await formatos(t)
  await t.comoDono()
  return t.fim('plano alimentar')
}
