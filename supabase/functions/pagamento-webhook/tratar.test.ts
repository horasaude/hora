import { describe, expect, it, vi } from 'vitest'
import { acaoParaPagamento } from '../_shared/pagamento/status.ts'
import { tratar } from './tratar.ts'

const TOKEN = 'a'.repeat(48)

const notificacao = (corpo: unknown, token: string | null = TOKEN) =>
  new Request('https://x.supabase.co/functions/v1/pagamento-webhook', {
    method: 'POST',
    headers: token ? { 'asaas-access-token': token } : {},
    body: JSON.stringify(corpo),
  })

const pago = { id: 'evt_1', event: 'PAYMENT_CONFIRMED', payment: { id: 'pay_123', status: 'X' } }

describe('webhook do Asaas', () => {
  it('token errado ou ausente: 401 e nada é processado', async () => {
    const processar = vi.fn()
    expect((await tratar(notificacao(pago, 'b'.repeat(48)), TOKEN, processar)).status).toBe(401)
    expect((await tratar(notificacao(pago, null), TOKEN, processar)).status).toBe(401)
    expect(processar).not.toHaveBeenCalled()
  })

  it('sem token configurado também recusa', async () => {
    const processar = vi.fn()
    expect((await tratar(notificacao(pago, ''), '', processar)).status).toBe(401)
    expect(processar).not.toHaveBeenCalled()
  })

  it('token certo: processa pelo evento e pelo id, não pelo status do corpo', async () => {
    const processar = vi.fn(async () => 'processado')
    const r = await tratar(notificacao(pago), TOKEN, processar)
    expect(r.status).toBe(200)
    expect(processar).toHaveBeenCalledWith({
      evento: 'PAYMENT_CONFIRMED',
      tipo: 'cobranca',
      id: 'pay_123',
    })
  })

  it('evento de assinatura e evento sem id', async () => {
    const processar = vi.fn(async () => 'processado')
    await tratar(
      notificacao({ event: 'SUBSCRIPTION_DELETED', subscription: { id: 'sub_9' } }),
      TOKEN,
      processar,
    )
    expect(processar).toHaveBeenCalledWith({
      evento: 'SUBSCRIPTION_DELETED',
      tipo: 'assinatura',
      id: 'sub_9',
    })
    const r = await tratar(notificacao({ event: 'CHECKOUT_PAID' }), TOKEN, processar)
    expect(await r.json()).toEqual({ ok: true, ignorado: true })
  })

  it('falha ao processar devolve 500 para o Asaas tentar de novo', async () => {
    const r = await tratar(notificacao(pago), TOKEN, async () => {
      throw new Error('banco fora')
    })
    expect(r.status).toBe(500)
  })

  it('reembolso de pedido aprovado encerra o acesso', () => {
    expect(acaoParaPagamento('aprovado', 'reembolsado')).toEqual({
      tipo: 'encerrar',
      status: 'reembolsado',
    })
  })
})
