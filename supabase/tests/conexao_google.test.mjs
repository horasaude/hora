import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)

async function montar(db) {
  await db.query(`insert into auth.users (id, email) values ($1,'p@t.com'),($2,'a@t.com')`, [
    ADMIN,
    ALUNA,
  ])
  await db.exec(`update public.perfis set papel = 'admin' where id = '${ADMIN}'`)
  await db.exec(
    `insert into public.conexao_google (conta, refresh_token) values ('lives@ora.com', 'segredo')`,
  )
}

async function testes(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaErro('aluna não lê a conexão', `select * from public.conexao_google`, '42501')
  await esperaValor(
    'aluna não vê a conta conectada',
    `select count(*)::int from public.google_conectado()`,
    0,
  )
  await t.comoAluna(ADMIN)
  await esperaErro(
    'nem a profissional lê o token',
    `select refresh_token from public.conexao_google`,
    '42501',
  )
  await esperaValor(
    'profissional vê só a conta conectada',
    `select conta from public.google_conectado()`,
    'lives@ora.com',
  )
  await t.comoServico()
  await esperaValor(
    'o servidor lê o token',
    `select refresh_token from public.conexao_google`,
    'segredo',
  )
  await esperaErro(
    'só existe uma conexão',
    `insert into public.conexao_google (id, conta, refresh_token) values (2, 'x', 'y')`,
    '23514',
  )
}

export async function testarConexaoGoogle() {
  const t = await criarBanco()
  await montar(t.db)
  await testes(t)
  return t.fim('conexão com o Google')
}
