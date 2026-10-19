import { describe, expect, it } from 'vitest'
import { acaoParaPagamento, situacaoDaCobranca, statusDoPagamento } from './status.ts'

describe('status do Asaas', () => {
  it('traduz cada status da cobrança', () => {
    expect(statusDoPagamento('CONFIRMED')).toBe('aprovado')
    expect(statusDoPagamento('RECEIVED')).toBe('aprovado')
    expect(statusDoPagamento('PENDING')).toBe('pendente')
    expect(statusDoPagamento('OVERDUE')).toBe('recusado')
    expect(statusDoPagamento('REFUNDED')).toBe('reembolsado')
    expect(statusDoPagamento('CHARGEBACK_REQUESTED')).toBe('chargeback')
    expect(statusDoPagamento('DUNNING_REQUESTED')).toBeNull()
  })

  it('cartão recusado e cobrança apagada', () => {
    const pendente = { status: 'PENDING' }
    expect(situacaoDaCobranca('PAYMENT_CREDIT_CARD_CAPTURE_REFUSED', pendente)).toBe('RECUSADO')
    expect(situacaoDaCobranca('PAYMENT_UPDATED', pendente)).toBe('PENDING')
    expect(situacaoDaCobranca('PAYMENT_CREDIT_CARD_CAPTURE_REFUSED', { status: 'CONFIRMED' })).toBe(
      'CONFIRMED',
    )
    expect(situacaoDaCobranca('PAYMENT_DELETED', { status: 'PENDING', deleted: true })).toBe(
      'DELETED',
    )
  })
})

describe('o que o webhook faz', () => {
  it('aprova pedido pendente', () => {
    expect(acaoParaPagamento('pendente', 'aprovado')).toEqual({ tipo: 'aprovar' })
  })

  it('notificação repetida não faz nada', () => {
    expect(acaoParaPagamento('aprovado', 'aprovado')).toEqual({ tipo: 'nada' })
  })

  it('reembolso e chargeback encerram', () => {
    expect(acaoParaPagamento('aprovado', 'reembolsado')).toEqual({
      tipo: 'encerrar',
      status: 'reembolsado',
    })
    expect(acaoParaPagamento('aprovado', 'chargeback')).toEqual({
      tipo: 'encerrar',
      status: 'chargeback',
    })
  })

  it('pedido aprovado nunca volta para pendente', () => {
    expect(acaoParaPagamento('aprovado', 'pendente')).toEqual({ tipo: 'nada' })
  })
})
