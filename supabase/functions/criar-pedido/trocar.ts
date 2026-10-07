import { ErroMp, mp } from '../_shared/mp.ts'
import { servico } from '../_shared/servico.ts'
import type { Cartao } from './entrada.ts'
import type { Resultado } from './pagar.ts'

/** Troca o cartão da assinatura mensal (link do e-mail de cobrança recusada). */
export async function trocarCartao(d: {
  pedido: string
  cartao: Cartao
}): Promise<[Resultado, number]> {
  const { data: pedido } = await servico
    .from('pedidos')
    .select('id, mp_assinatura_id, plano, status')
    .eq('id', d.pedido)
    .single<{ id: string; mp_assinatura_id: string | null; plano: string; status: string }>()
  if (!pedido?.mp_assinatura_id || pedido.plano !== 'recorrente' || pedido.status !== 'aprovado')
    return [{ ok: false, erro: 'nao_encontrado' }, 404]
  try {
    await mp.atualizarAssinatura(pedido.mp_assinatura_id, { card_token_id: d.cartao.token })
    return [{ ok: true, pedido: pedido.id, status: 'aprovado' }, 200]
  } catch (e) {
    if (!(e instanceof ErroMp) || e.status >= 500) throw e
    return [{ ok: false, pedido: pedido.id, status: 'recusado', motivo: 'dados' }, 200]
  }
}
