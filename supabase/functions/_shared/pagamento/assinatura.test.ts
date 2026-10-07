import { describe, expect, it } from 'vitest'
import { assinaturaValida, hmacHex, manifesto } from './assinatura.ts'

const segredo = 'segredo-de-teste'

async function assinar(dataId: string, requestId: string, ts = '1742505638683') {
  return `ts=${ts},v1=${await hmacHex(segredo, manifesto(dataId, requestId, ts))}`
}

describe('assinatura do webhook', () => {
  it('monta o manifesto como a documentação', () => {
    expect(manifesto('123', 'abc', '99')).toBe('id:123;request-id:abc;ts:99;')
    expect(manifesto(null, 'abc', '99')).toBe('request-id:abc;ts:99;')
  })

  it('aceita assinatura certa', async () => {
    const xSignature = await assinar('123456', 'req-1')
    expect(
      await assinaturaValida({ xSignature, xRequestId: 'req-1', dataId: '123456', segredo }),
    ).toBe(true)
  })

  it('aceita data.id alfanumérico em minúsculas', async () => {
    const xSignature = await assinar('2c938084abc', 'req-2')
    expect(
      await assinaturaValida({ xSignature, xRequestId: 'req-2', dataId: '2C938084ABC', segredo }),
    ).toBe(true)
  })

  it('recusa assinatura inválida, trocada ou ausente', async () => {
    const xSignature = await assinar('123456', 'req-1')
    const base = { xRequestId: 'req-1', dataId: '123456', segredo }
    expect(await assinaturaValida({ ...base, xSignature: null })).toBe(false)
    expect(await assinaturaValida({ ...base, xSignature: 'ts=1,v1=abc' })).toBe(false)
    expect(await assinaturaValida({ ...base, dataId: '999', xSignature })).toBe(false)
    expect(await assinaturaValida({ ...base, segredo: 'outro', xSignature })).toBe(false)
    expect(await assinaturaValida({ ...base, segredo: '', xSignature })).toBe(false)
  })
})
