import { criarBanco } from './harness.mjs'

export async function testarPerfis() {
  const t = await criarBanco()
  const { db, esperaValor, esperaErro, comoAluna, comoAnon, comoDono } = t
  const A = '00000000-0000-0000-0000-00000000000a'
  const B = '00000000-0000-0000-0000-00000000000b'

  await db.query(
    `insert into auth.users (id, email, raw_user_meta_data) values
     ($1, 'a@teste.com', '{"nome":"Aluna A"}'), ($2, 'b@teste.com', '{}')`,
    [A, B]
  )
  await esperaValor('trigger cria um perfil por usuária', 'select count(*)::int from public.perfis', 2)
  await esperaValor(
    'perfil recebe o nome do cadastro',
    `select nome from public.perfis where id = '${A}'`,
    'Aluna A'
  )

  await comoAluna(A)
  await esperaValor('aluna A só enxerga o próprio perfil', 'select count(*)::int from public.perfis', 1)
  await esperaValor('aluna A não é admin', 'select public.eh_admin()', false)
  await esperaErro(
    'aluna não consegue se promover a admin',
    `update public.perfis set papel = 'admin' where id = '${A}'`,
    '42501'
  )
  await db.query(`update public.perfis set apelido = 'Bia' where id = '${B}'`)
  await comoDono()
  await esperaValor(
    'aluna A não edita o perfil da aluna B',
    `select coalesce(apelido, '') from public.perfis where id = '${B}'`,
    ''
  )

  await comoAnon()
  await esperaValor('visitante sem login não vê perfis', 'select count(*)::int from public.perfis', 0)

  await comoDono()
  await db.query(`update public.perfis set papel = 'admin' where id = '${B}'`)
  await comoAluna(B)
  await esperaValor('admin enxerga todos os perfis', 'select count(*)::int from public.perfis', 2)

  return t.fim('perfis')
}
