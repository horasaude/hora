import { criarBanco } from './harness.mjs'
import { ativo, ID, montar, pedido } from './pagamentos.test.mjs'

const ALUNA = ID(2)
const MENSAL = ID(103)
const PIX = ID(101)
const OFERTA = ID(102)

async function duasCompras(t) {
  const { esperaValor } = t
  await t.comoServico()
  await t.db.exec(
    `select public.aprovar_pedido('${PIX}', '${ALUNA}', now()); select public.aprovar_pedido('${OFERTA}', '${ALUNA}', now());`,
  )
  await esperaValor(
    'estorno de uma compra',
    `select public.encerrar_pedido('${OFERTA}', 'reembolsado')`,
    true,
  )
  await esperaValor('com outra compra aprovada, o acesso continua', ativo(ALUNA), true)
  await esperaValor(
    'estorno da última compra',
    `select public.encerrar_pedido('${PIX}', 'reembolsado')`,
    true,
  )
  await esperaValor('sem compra aprovada, o acesso termina', ativo(ALUNA), false)
}

export async function testarCancelamento() {
  const t = await criarBanco()
  const { esperaValor, esperaErro } = t
  await montar(t.db)
  await t.db.exec(pedido(MENSAL, 'recorrente', false))
  await t.comoServico()
  await esperaErro(
    'tipo sem data não entra',
    `update public.pedidos set cancelamento_tipo = 'nao_renovar' where id = '${MENSAL}'`,
    '23514',
  )
  await esperaErro(
    'tipo fora da lista não entra',
    `update public.pedidos set cancelamento_pedido_em = now(), cancelamento_tipo = 'outro' where id = '${MENSAL}'`,
    '23514',
  )
  await esperaValor(
    'servidor registra o pedido de não renovar uma vez',
    `with r as (update public.pedidos set cancelamento_pedido_em = now(), cancelamento_tipo = 'nao_renovar'
       where id = '${MENSAL}' and cancelamento_pedido_em is null returning 1) select count(*)::int from r`,
    1,
  )
  await esperaValor(
    'segundo pedido não sobrescreve',
    `with r as (update public.pedidos set cancelamento_pedido_em = now(), cancelamento_tipo = 'arrependimento'
       where id = '${MENSAL}' and cancelamento_pedido_em is null returning 1) select count(*)::int from r`,
    0,
  )
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna não lê pedidos de cancelamento',
    `select count(*)::int from public.pedidos where cancelamento_pedido_em is not null`,
    0,
  )
  await esperaErro(
    'aluna não marca cancelamento direto',
    `update public.pedidos set cancelamento_pedido_em = now(), cancelamento_tipo = 'nao_renovar'`,
    '42501',
  )
  await t.comoAluna(ID(1))
  await esperaValor(
    'admin vê o pedido de cancelamento',
    `select cancelamento_tipo from public.pedidos where id = '${MENSAL}'`,
    'nao_renovar',
  )
  await duasCompras(t)
  return t.fim('cancelamento')
}
