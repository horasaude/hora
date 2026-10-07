import { criarBanco } from './harness.mjs'
import { ID, MENSAL, MENSAL_NOVA, ativo, montar, pedido } from './pagamentos.test.mjs'

const ALUNA = ID(2)
const evento = (pedidoId, cobranca, status) =>
  `insert into public.eventos_pagamento (tipo, recurso_id, status, pedido_id) values ('subscription_authorized_payment', '${cobranca}', '${status}', '${pedidoId}') on conflict do nothing`
const cobranca = (pedidoId, aprovada) =>
  `select public.cobranca_assinatura('${pedidoId}', ${aprovada}, now(), now() + interval '1 month') ->> 'parcelas_pagas'`
const status = `select status from public.assinaturas where pedido_id = '${MENSAL}'`

async function preparar(t) {
  await montar(t.db)
  await t.db.exec(`
    ${pedido(MENSAL, 'recorrente', false)};
    ${pedido(MENSAL_NOVA, 'recorrente', false)};
    update public.pedidos set email = 'nova@t.com' where id = '${MENSAL_NOVA}';
  `)
  await t.comoServico()
  await t.db.query(
    `select public.registrar_assinatura('${MENSAL}', 'mp-a1', now() + interval '1 month')`,
  )
  await t.db.query(`select public.registrar_assinatura('${MENSAL_NOVA}', 'mp-a2', null)`)
}

async function cobrancas(t) {
  const { esperaValor, db } = t
  await db.query(evento(MENSAL, 'c1', 'approved'))
  await db.query(
    `select public.aprovar_pedido('${MENSAL}', '${ALUNA}', now() - interval '20 days')`,
  )
  await esperaValor('primeira cobrança aprovada conta 1 de 12', cobranca(MENSAL, true), '1')
  await db.query(evento(MENSAL, 'c1', 'approved'))
  await esperaValor('a mesma cobrança repetida não soma de novo', cobranca(MENSAL, true), '1')
  await db.query(evento(MENSAL, 'c2', 'rejected'))
  await esperaValor('cobrança recusada não soma', cobranca(MENSAL, false), '1')
  await esperaValor('recusa marca inadimplência', status, 'inadimplente')
  await db.query(
    `update public.assinaturas set inadimplente_desde = now() - interval '6 days' where pedido_id = '${MENSAL}'`,
  )
  await esperaValor('com 6 dias ainda não suspende', `select public.suspender_inadimplentes()`, 0)
  await db.query(
    `update public.assinaturas set inadimplente_desde = now() - interval '8 days' where pedido_id = '${MENSAL}'`,
  )
  await esperaValor('com 7 dias sem pagar suspende', `select public.suspender_inadimplentes()`, 1)
  await esperaValor('acesso suspenso', ativo(ALUNA), false)
  await t.comoAluna(ALUNA)
  await esperaValor('aluna suspensa não tem acesso', `select public.tem_acesso_ativo()`, false)
  await t.comoServico()
  await db.query(evento(MENSAL, 'c2', 'approved'))
  await esperaValor('cobrança aprovada depois soma 2', cobranca(MENSAL, true), '2')
  await esperaValor('acesso volta sozinho', ativo(ALUNA), true)
  await esperaValor('assinatura ativa de novo', status, 'ativa')
}

async function cancelamentos(t) {
  const { esperaValor, db } = t
  await esperaValor(
    'cancelar depois de 7 dias mantém só o período pago',
    `select public.cancelar_assinatura('${MENSAL}')`,
    'cancelada',
  )
  await esperaValor(
    'acesso até um mês depois da última cobrança',
    `select acesso_fim_em <= now() + interval '1 month' + interval '1 minute' from public.perfis where id = '${ALUNA}'`,
    true,
  )
  const NOVA = ID(5)
  await t.comoDono()
  await db.query(`insert into auth.users (id, email) values ('${NOVA}', 'nova@t.com')`)
  await t.comoServico()
  await db.query(evento(MENSAL_NOVA, 'n1', 'approved'))
  await db.query(
    `select public.aprovar_pedido('${MENSAL_NOVA}', '${NOVA}', now() - interval '2 days')`,
  )
  await esperaValor(
    'cancelar em até 7 dias é arrependimento',
    `select public.cancelar_assinatura('${MENSAL_NOVA}')`,
    'arrependimento',
  )
  await esperaValor('arrependimento encerra o acesso', ativo(NOVA), false)
  await esperaValor(
    'pedido fica cancelado',
    `select status from public.pedidos where id = '${MENSAL_NOVA}'`,
    'cancelado',
  )
}

export async function testarAssinaturas() {
  const t = await criarBanco()
  await preparar(t)
  await cobrancas(t)
  await cancelamentos(t)
  return t.fim('assinaturas')
}
