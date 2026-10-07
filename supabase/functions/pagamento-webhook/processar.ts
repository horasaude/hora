import { mp } from '../_shared/mp.ts'
import {
  acaoParaPagamento,
  statusDoPagamento,
  type StatusPedido,
} from '../_shared/pagamento/status.ts'
import { servico } from '../_shared/servico.ts'
import { avisarRecusa, CAMPOS_PEDIDO, liberar, type Pedido } from './conta.ts'
import { abrirEvento, fecharEvento, rpc } from './eventos.ts'

const UUID = /^[0-9a-f-]{36}$/i

async function pedidoPor(coluna: 'id' | 'mp_assinatura_id', valor: string | undefined) {
  if (!valor || (coluna === 'id' && !UUID.test(valor))) return null
  const { data } = await servico
    .from('pedidos')
    .select(CAMPOS_PEDIDO)
    .eq(coluna, valor)
    .maybeSingle<Pedido>()
  return data
}

/** Roda o passo uma vez por notificação; se falhar, guarda o erro e o Mercado Pago tenta de novo. */
async function umaVez(
  tipo: string,
  id: string,
  status: string,
  pedido: Pedido,
  dados: unknown,
  passo: () => Promise<void>,
) {
  const evento = await abrirEvento(tipo, id, status, pedido.id, dados)
  if (!evento) return 'repetido'
  try {
    await passo()
    await fecharEvento(evento)
    return 'processado'
  } catch (e) {
    await fecharEvento(evento, e instanceof Error ? e.message : String(e))
    throw e
  }
}

async function pagamento(id: string) {
  const p = await mp.pagamento(id)
  const pedido = await pedidoPor('id', p.external_reference)
  if (!pedido) return 'sem_pedido'
  const novo = statusDoPagamento(p.status)
  return umaVez(
    'payment',
    id,
    p.status,
    pedido,
    { status: p.status, detalhe: p.status_detail },
    async () => {
      if (pedido.plano === 'recorrente') {
        if (novo === 'reembolsado' || novo === 'chargeback')
          await rpc('encerrar_pedido', { p_pedido: pedido.id, p_status: novo })
        return
      }
      const acao = acaoParaPagamento(pedido.status as StatusPedido, novo)
      if (acao.tipo === 'aprovar')
        await liberar(pedido, p.date_approved ?? new Date().toISOString())
      if (acao.tipo === 'encerrar')
        await rpc('encerrar_pedido', { p_pedido: pedido.id, p_status: acao.status })
      if (acao.tipo === 'marcar')
        await rpc('marcar_pedido', {
          p_pedido: pedido.id,
          p_status: acao.status,
          p_detalhe: p.status_detail ?? '',
        })
    },
  )
}

async function assinatura(id: string) {
  const a = await mp.assinatura(id)
  const pedido = await pedidoPor('id', a.external_reference)
  if (!pedido) return 'sem_pedido'
  return umaVez(
    'subscription_preapproval',
    id,
    a.status,
    pedido,
    { status: a.status },
    async () => {
      await rpc('registrar_assinatura', {
        p_pedido: pedido.id,
        p_mp_assinatura: a.id,
        p_proxima: a.next_payment_date ?? null,
      })
      if (a.status === 'cancelled') await rpc('cancelar_assinatura', { p_pedido: pedido.id })
    },
  )
}

async function cobranca(id: string) {
  const c = await mp.cobranca(id)
  const pedido = await pedidoPor('mp_assinatura_id', c.preapproval_id)
  const status = c.payment?.status ?? ''
  if (!pedido || (status !== 'approved' && status !== 'rejected')) return 'ignorado'
  return umaVez(
    'subscription_authorized_payment',
    id,
    status,
    pedido,
    { status, cobranca: c.status },
    async () => {
      const quando = c.debit_date ?? c.date_created ?? new Date().toISOString()
      const a = await mp.assinatura(c.preapproval_id!)
      if (status === 'approved' && pedido.status !== 'aprovado')
        await liberar(pedido, new Date().toISOString())
      await rpc('cobranca_assinatura', {
        p_pedido: pedido.id,
        p_aprovada: status === 'approved',
        p_quando: quando,
        p_proxima: a.next_payment_date ?? null,
      })
      if (status === 'rejected' && pedido.status === 'aprovado') await avisarRecusa(pedido, id)
      if (status === 'rejected' && pedido.status !== 'aprovado')
        await rpc('marcar_pedido', {
          p_pedido: pedido.id,
          p_status: 'recusado',
          p_detalhe: c.payment?.status_detail ?? '',
        })
    },
  )
}

export async function processar(tipo: string, id: string): Promise<string> {
  if (tipo === 'payment') return pagamento(id)
  if (tipo === 'subscription_preapproval') return assinatura(id)
  if (tipo === 'subscription_authorized_payment') return cobranca(id)
  return 'ignorado'
}
