// Tradução dos status do Mercado Pago para o pedido do ORA e para a mensagem da tela.

export type StatusPedido =
  'criado' | 'pendente' | 'aprovado' | 'recusado' | 'reembolsado' | 'cancelado' | 'chargeback'

/** Status de um pagamento (/v1/payments) para o status do pedido. Sem par conhecido: null (ignora). */
export function statusDoPagamento(status: string | undefined): StatusPedido | null {
  switch (status) {
    case 'approved':
      return 'aprovado'
    case 'pending':
    case 'in_process':
    case 'authorized':
      return 'pendente'
    case 'rejected':
      return 'recusado'
    case 'refunded':
      return 'reembolsado'
    case 'cancelled':
      return 'cancelado'
    case 'charged_back':
      return 'chargeback'
    default:
      return null
  }
}

export type MotivoRecusa = 'saldo' | 'dados' | 'banco' | 'outro'

/** Motivo da recusa do cartão (status_detail) em uma das mensagens que a tela sabe mostrar. */
export function motivoRecusa(detalhe: string | null | undefined): MotivoRecusa {
  const d = detalhe ?? ''
  if (d === 'cc_rejected_insufficient_amount') return 'saldo'
  if (
    d.startsWith('cc_rejected_bad_filled') ||
    d === 'cc_rejected_invalid_installments' ||
    d === 'cc_rejected_card_disabled'
  )
    return 'dados'
  if (
    d === 'cc_rejected_call_for_authorize' ||
    d === 'cc_rejected_high_risk' ||
    d === 'cc_rejected_blacklist' ||
    d === 'cc_rejected_card_error' ||
    d === 'cc_rejected_max_attempts' ||
    d === 'cc_rejected_duplicated_payment' ||
    d === 'cc_rejected_other_reason'
  )
    return 'banco'
  return 'outro'
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
