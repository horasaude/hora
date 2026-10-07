import { describe, expect, it, vi } from 'vitest'
import { hmacHex, manifesto } from '../_shared/pagamento/assinatura.ts'
import { acaoParaPagamento } from '../_shared/pagamento/status.ts'
import { tratar } from './tratar.ts'

const SEGREDO = 'segredo-webhook'

async function notificacao(id: string, opcoes: { segredo?: string; requestId?: string } = {}) {
  const ts = '1760000000'
  const requestId = opcoes.requestId ?? 'req-1'
  const v1 = await hmacHex(opcoes.segredo ?? SEGREDO, manifesto(id, requestId, ts))
  return new Request(
    `https://x.supabase.co/functions/v1/pagamento-webhook?data.id=${id}&type=payment`,
    {
      method: 'POST',
      headers: { 'x-signature': `ts=${ts},v1=${v1}`, 'x-request-id': requestId },
      body: JSON.stringify({ type: 'payment', action: 'payment.updated', data: { id } }),
    },
  )
}

describe('webhook do Mercado Pago', () => {
  it('assinatura inválida: 401 e nada é processado', async () => {
    const processar = vi.fn()
    const r = await tratar(await notificacao('123', { segredo: 'errado' }), SEGREDO, processar)
    expect(r.status).toBe(401)
    expect(processar).not.toHaveBeenCalled()
  })

  it('sem segredo configurado também recusa', async () => {
    const processar = vi.fn()
    expect((await tratar(await notificacao('123'), '', processar)).status).toBe(401)
    expect(processar).not.toHaveBeenCalled()
  })

  it('assinatura válida: processa pelo id da notificação, não pelo corpo', async () => {
    const processar = vi.fn(async () => 'processado')
    const r = await tratar(await notificacao('123'), SEGREDO, processar)
    expect(r.status).toBe(200)
    expect(processar).toHaveBeenCalledWith('payment', '123')
  })

  it('notificação repetida responde 200 sem refazer nada', async () => {
    const vistos = new Set<string>()
    const processar = vi.fn(async (_t: string, id: string) => {
      if (vistos.has(id)) return 'repetido'
      vistos.add(id)
      return 'processado'
    })
    await tratar(await notificacao('777'), SEGREDO, processar)
    const r = await tratar(await notificacao('777', { requestId: 'req-2' }), SEGREDO, processar)
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, resultado: 'repetido' })
  })

  it('falha ao processar devolve 500 para o Mercado Pago tentar de novo', async () => {
    const r = await tratar(await notificacao('9'), SEGREDO, async () => {
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
