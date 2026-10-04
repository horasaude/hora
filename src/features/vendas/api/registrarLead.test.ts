import { afterEach, describe, expect, it, vi } from 'vitest'
import { registrarLead } from './registrarLead'

const dados = {
  plano: 'pix' as const,
  nome: 'Maria',
  email: 'maria@teste.com',
  whatsapp: '(98) 98765-4321',
  site: '',
}

describe('registrarLead', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('envia os dados limpos para a Edge Function', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('{"ok":true}'))
    vi.stubGlobal('fetch', fetch)
    expect(await registrarLead(dados)).toBe(true)
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://teste.local/functions/v1/cadastrar-interessada')
    expect(JSON.parse(String(init.body))).toMatchObject({ whatsapp: '98987654321', plano: 'pix' })
  })

  it('não lança se a rede falhar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    expect(await registrarLead(dados)).toBe(false)
  })

  it('desiste depois do tempo limite, sem travar a venda', async () => {
    const pendurado = (_: string, init: RequestInit) =>
      new Promise<Response>((_, rejeitar) =>
        init.signal?.addEventListener('abort', () => rejeitar(new Error('abortado'))),
      )
    vi.stubGlobal('fetch', vi.fn(pendurado))
    expect(await registrarLead(dados, 20)).toBe(false)
  })
})
