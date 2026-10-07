import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ANA = ID(1)
const LAIS = ID(2)
const ALUNA = ID(3)

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email, last_sign_in_at) values ($1, 'ana@t.com', now()), ($2, 'lais@t.com', null), ($3, 'aluna@t.com', now())`,
    [ANA, LAIS, ALUNA],
  )
  await db.exec(`
    update public.perfis set papel = 'admin', nome = 'Ana Milhomem' where id = '${ANA}';
    update public.perfis set papel = 'admin', nome = 'Laís Moraes' where id = '${LAIS}';
  `)
}

export async function testarEquipe() {
  const t = await criarBanco()
  const { esperaValor, esperaErro } = t
  await montar(t.db)
  await t.comoAluna(ALUNA)
  await esperaErro('aluna não vê a equipe', `select * from public.painel_equipe()`, '42501')
  await esperaErro(
    'aluna não edita',
    `select public.editar_profissional('${LAIS}', 'X', null, null)`,
    '42501',
  )
  await esperaErro(
    'aluna não tira acesso',
    `select public.remover_profissional('${LAIS}')`,
    '42501',
  )
  await t.comoAluna(ANA)
  await esperaValor('equipe tem 2', `select count(*)::int from public.painel_equipe()`, 2)
  await esperaValor(
    'e-mail aparece',
    `select email from public.painel_equipe() where id = '${LAIS}'`,
    'lais@t.com',
  )
  await esperaValor(
    'convite pendente de quem nunca entrou',
    `select convite_pendente from public.painel_equipe() where id = '${LAIS}'`,
    true,
  )
  await esperaValor(
    'marca quem está logada',
    `select eu from public.painel_equipe() where id = '${ANA}'`,
    true,
  )
  await t.db.query(
    `select public.editar_profissional('${LAIS}', ' Laís M. ', 'treino', 'Educadora física')`,
  )
  await esperaValor(
    'edita nome e especialidade',
    `select nome || '/' || especialidade from public.perfis where id = '${LAIS}'`,
    'Laís M./treino',
  )
  await esperaErro(
    'não edita aluna como profissional',
    `select public.editar_profissional('${ALUNA}', 'X', null, null)`,
    '22023',
  )
  await esperaErro(
    'não tira o próprio acesso',
    `select public.remover_profissional('${ANA}')`,
    '22023',
  )
  await t.db.query(`select public.remover_profissional('${LAIS}')`)
  await esperaValor(
    'tirar acesso volta para aluna',
    `select papel::text from public.perfis where id = '${LAIS}'`,
    'aluna',
  )
  await esperaValor('equipe fica com 1', `select count(*)::int from public.painel_equipe()`, 1)
  await t.comoDono()
  return t.fim('equipe')
}
