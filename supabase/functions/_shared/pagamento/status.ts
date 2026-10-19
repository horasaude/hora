// Tradução dos status do Asaas para o pedido do ORA.

export type StatusPedido =
  'criado' | 'pendente' | 'aprovado' | 'recusado' | 'reembolsado' | 'cancelado' | 'chargeback'

/** Status de uma cobrança do Asaas para o status do pedido. Sem par conhecido: null (ignora). */
export function statusDoPagamento(status: string | undefined): StatusPedido | null {
  switch (status) {
    case 'CONFIRMED':
    case 'RECEIVED':
    case 'RECEIVED_IN_CASH':
      return 'aprovado'
    case 'PENDING':
    case 'AWAITING_RISK_ANALYSIS':
      return 'pendente'
    case 'OVERDUE':
    case 'RECUSADO':
      return 'recusado'
    case 'REFUNDED':
    case 'REFUND_REQUESTED':
    case 'REFUND_IN_PROGRESS':
      return 'reembolsado'
    case 'DELETED':
      return 'cancelado'
    case 'CHARGEBACK_REQUESTED':
    case 'CHARGEBACK_DISPUTE':
    case 'AWAITING_CHARGEBACK_REVERSAL':
      return 'chargeback'
    default:
      return null
  }
}

/** Eventos do Asaas em que o cartão foi recusado sem mudar o status da cobrança. */
const EVENTOS_RECUSA = ['PAYMENT_CREDIT_CARD_CAPTURE_REFUSED', 'PAYMENT_REPROVED_BY_RISK_ANALYSIS']

/** Situação usada no webhook: o status da API, a recusa do evento ou a cobrança apagada. */
export function situacaoDaCobranca(evento: string, c: { status: string; deleted?: boolean }) {
  if (c.deleted) return 'DELETED'
  if (EVENTOS_RECUSA.includes(evento) && c.status === 'PENDING') return 'RECUSADO'
  return c.status
}

/** O que o webhook faz com o pedido diante do status vindo da API. */
export type Acao =
  | { tipo: 'aprovar' }
  | { tipo: 'encerrar'; status: 'reembolsado' | 'cancelado' | 'chargeback' }
  | { tipo: 'marcar'; status: 'pendente' | 'recusado' }
  | { tipo: 'nada' }

export function acaoParaPagamento(atual: StatusPedido, novo: StatusPedido | null): Acao {
  if (!novo || novo === atual) return { tipo: 'nada' }
  if (novo === 'aprovado') return { tipo: 'aprovar' }
  if (novo === 'reembolsado' || novo === 'chargeback') return { tipo: 'encerrar', status: novo }
  if (novo === 'cancelado') return { tipo: 'encerrar', status: 'cancelado' }
  if (atual === 'aprovado') return { tipo: 'nada' }
  if (novo === 'pendente' || novo === 'recusado') return { tipo: 'marcar', status: novo }
  return { tipo: 'nada' }
}
