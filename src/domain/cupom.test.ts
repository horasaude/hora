import { describe, expect, it } from 'vitest'
import { aplicarCupom, cupomVale, precosComCupom, type Cupom } from './cupom'
import { precosPara } from './precos'

const dez: Cupom = { codigo: 'ORA10', tipo: 'porcentagem', valor: 10, planos: ['pix', 'parcelado'] }

describe('cupom', () => {
  it('tira a porcentagem ou o valor, sem passar do mínimo do Asaas', () => {
    expect(aplicarCupom(189700, dez)).toBe(170730)
    expect(aplicarCupom(21770, { tipo: 'valor', valor: 5000 })).toBe(16770)
    expect(aplicarCupom(21770, { tipo: 'valor', valor: 99999 })).toBe(500)
  })

  it('muda só os planos em que vale; no parcelado, sobre o total', () => {
    const p = precosPara(false)
    const c = precosComCupom(p, dez)
    expect(c.pixCentavos).toBe(aplicarCupom(p.pixCentavos, dez))
    expect(c.parceladoCentavos * c.parcelas).toBe(aplicarCupom(p.parceladoCentavos * 12, dez))
    expect(c.recorrenteCentavos).toBe(p.recorrenteCentavos)
    expect(cupomVale(dez, 'recorrente')).toBe(false)
    expect(precosComCupom(p, null)).toBe(p)
  })
})
