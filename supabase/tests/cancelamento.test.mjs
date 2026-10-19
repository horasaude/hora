import { criarBanco } from './harness.mjs'
import { ID, montar, pedido } from './pagamentos.test.mjs'

const ALUNA = ID(2)
const MENSAL = ID(103)

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
  return t.fim('cancelamento')
}
