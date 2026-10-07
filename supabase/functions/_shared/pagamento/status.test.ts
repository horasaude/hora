import { describe, expect, it } from 'vitest'
import { acaoParaPagamento, motivoRecusa, statusDoPagamento } from './status.ts'

describe('status do Mercado Pago', () => {
  it('traduz cada status do pagamento', () => {
    expect(statusDoPagamento('approved')).toBe('aprovado')
    expect(statusDoPagamento('pending')).toBe('pendente')
    expect(statusDoPagamento('in_process')).toBe('pendente')
    expect(statusDoPagamento('rejected')).toBe('recusado')
    expect(statusDoPagamento('refunded')).toBe('reembolsado')
    expect(statusDoPagamento('cancelled')).toBe('cancelado')
    expect(statusDoPagamento('charged_back')).toBe('chargeback')
    expect(statusDoPagamento('in_mediation')).toBeNull()
  })

  it('motivo da recusa em linguagem da tela', () => {
    expect(motivoRecusa('cc_rejected_insufficient_amount')).toBe('saldo')
    expect(motivoRecusa('cc_rejected_bad_filled_security_code')).toBe('dados')
    expect(motivoRecusa('cc_rejected_call_for_authorize')).toBe('banco')
    expect(motivoRecusa('qualquer_coisa')).toBe('outro')
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
