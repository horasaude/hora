import { criarBanco } from './harness.mjs'

const INSERIR = (plano = 'pix', whatsapp = '98987654321', email = `'maria@teste.com'`) => `
  insert into public.interessadas (nome, email, whatsapp, plano_escolhido, utm_source)
  values ('Maria', ${email}, '${whatsapp}', '${plano}', 'instagram')`

export async function testarInteressadas() {
  const t = await criarBanco()
  const { db, esperaValor, esperaErro, comoAluna, comoAnon, comoServico, comoDono } = t
  const ALUNA = '00000000-0000-0000-0000-00000000000a'
  const ADMIN = '00000000-0000-0000-0000-00000000000b'
  await db.query(`insert into auth.users (id, email) values ($1, 'a@t.com'), ($2, 'b@t.com')`, [
    ALUNA,
    ADMIN,
  ])
  await db.query(`update public.perfis set papel = 'admin' where id = $1`, [ADMIN])

  await comoServico()
  await esperaValor('service role grava interessada', `${INSERIR()} returning 1`, 1)
  await esperaErro('plano fora da lista é recusado', INSERIR('anual'), '23514')
  await esperaErro('WhatsApp com letras é recusado', INSERIR('pix', '98abc'), '23514')
  await esperaErro('cadastro sem e-mail é recusado', INSERIR('pix', '98987654321', 'null'), '23502')
  await esperaValor(
    'colunas de contrato não existem mais',
    `select count(*)::int from information_schema.columns where table_name = 'interessadas' and column_name in ('aceitou_termos_em', 'versao_termos')`,
    0,
  )

  await comoAnon()
  await esperaErro('visitante não lê interessadas', 'select * from public.interessadas', '42501')
  await esperaErro('visitante não grava direto na tabela', INSERIR(), '42501')

  await comoAluna(ALUNA)
  await esperaValor('aluna não vê interessadas', 'select count(*)::int from public.interessadas', 0)
  await esperaErro('aluna não grava interessada', INSERIR(), '42501')
  await esperaErro('aluna não apaga interessada', 'delete from public.interessadas', '42501')

  await comoAluna(ADMIN)
  await esperaValor('admin vê as interessadas', 'select count(*)::int from public.interessadas', 1)
  await esperaErro(
    'admin não altera interessada pelo app',
    `update public.interessadas set nome = 'x'`,
    '42501',
  )

  await comoDono()
  return t.fim('interessadas')
}
