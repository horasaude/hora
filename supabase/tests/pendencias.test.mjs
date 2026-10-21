import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const OUTRA = ID(3)
const ANAMNESE = `(select id from public.anamneses where titulo = 'Anamnese inicial')`
const situacao = (item) =>
  `select feito::text || ':' || andamento::text from public.pendencias_aluna('${ALUNA}') where item = ${item}`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'o@t.com')`,
    [ADMIN, ALUNA, OUTRA],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '9 days' where id in ('${ALUNA}', '${OUTRA}');
    update public.anamneses set publicada = true;
  `)
}

async function equipe(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaErro('aluna não vê a lista de outra', `select * from public.pendencias_aluna('${OUTRA}')`, '42501')
  await t.comoAluna(ADMIN)
  await esperaValor(
    'ficha lista anamnese, 5 passos do Comece, tema (dia 10) e treino',
    `select count(*)::int from public.pendencias_aluna('${ALUNA}')`,
    8,
  )
  await esperaValor('anamnese ainda não começada', situacao(`'anamnese:' || ${ANAMNESE}`), 'false:false')
  await t.comoAluna(ALUNA)
  await t.db.query(`insert into public.anamnese_respostas (anamnese_id, respostas) values (${ANAMNESE}, '{}')`)
  await t.comoAluna(ADMIN)
  await esperaValor('anamnese em andamento', situacao(`'anamnese:' || ${ANAMNESE}`), 'false:true')
  await esperaValor(
    'lembrar cria o aviso',
    `select novo from public.lembrar_aluna('${ALUNA}', 'tema')`,
    true,
  )
  await esperaValor(
    'lembrar de novo no mesmo dia não repete',
    `select novo from public.lembrar_aluna('${ALUNA}', 'tema')`,
    false,
  )
  await esperaErro(
    'item que não existe não é lembrado',
    `select * from public.lembrar_aluna('${ALUNA}', 'qualquer')`,
    '22023',
  )
}

async function aluna(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor('aluna vê o pedido da equipe', `select string_agg(item, ',') from public.meus_lembretes()`, 'tema')
  await esperaErro('aluna não lembra ninguém', `select * from public.lembrar_aluna('${OUTRA}', 'tema')`, '42501')
  await esperaErro(
    'aluna não cria lembrete direto',
    `insert into public.lembretes_aluna (perfil_id, item) values ('${ALUNA}', 'x')`,
    '42501',
  )
  await t.comoDono()
  await t.db.query(
    `update public.perfis set tema_atual_id = (select id from public.temas where tipo = 'tema' limit 1) where id = '${ALUNA}'`,
  )
  await t.comoAluna(ALUNA)
  await esperaValor('feito, o pedido some', `select count(*)::int from public.meus_lembretes()`, 0)
  await t.comoAluna(OUTRA)
  await esperaValor('outra aluna não vê', `select count(*)::int from public.lembretes_aluna`, 0)
}

export async function testarPendencias() {
  const t = await criarBanco()
  await montar(t.db)
  await equipe(t)
  await aluna(t)
  return t.fim('pendências da aluna e lembretes da equipe')
}
