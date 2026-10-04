import { describe, expect, it } from 'vitest'
import { FIM_OFERTA_ORA } from './oferta'
import { DESCONTO_OFERTA_CENTAVOS, precosPara, precosVigentes, tempoRestanteOferta } from './precos'

const segundos = (s: number) => new Date(FIM_OFERTA_ORA.getTime() + s * 1000)

describe('precosVigentes', () => {
  it('mostra a oferta do ORA um segundo antes do fim', () => {
    expect(precosVigentes(segundos(-1))).toEqual({
      emOferta: true,
      parcelas: 12,
      parceladoCentavos: 19800,
      recorrenteCentavos: 21500,
      pixCentavos: 199700,
      mesesAcesso: 13,
      ancoraCentavos: 229700,
    })
  })

  it('ainda é oferta no último segundo (24/10 23h59m59s de Brasília)', () => {
    expect(precosVigentes(FIM_OFERTA_ORA).emOferta).toBe(true)
  })

  it('troca sozinho para os preços cheios um segundo depois', () => {
    expect(precosVigentes(segundos(1))).toEqual({
      emOferta: false,
      parcelas: 12,
      parceladoCentavos: 22700,
      recorrenteCentavos: 24700,
      pixCentavos: 229700,
      mesesAcesso: 12,
      ancoraCentavos: null,
    })
  })
})

describe('precosPara', () => {
  it('devolve a mesma tabela que precosVigentes dentro e fora da oferta', () => {
    expect(precosPara(true)).toEqual(precosVigentes(segundos(-1)))
    expect(precosPara(false)).toEqual(precosVigentes(segundos(1)))
  })
})

describe('DESCONTO_OFERTA_CENTAVOS', () => {
  it('é a diferença do Pix cheio para o Pix da oferta: R$ 300', () => {
    expect(DESCONTO_OFERTA_CENTAVOS).toBe(30000)
  })
})

describe('tempoRestanteOferta', () => {
  it('quebra o tempo em dias, horas, minutos e segundos', () => {
    const faltam = 2 * 86400 + 3 * 3600 + 4 * 60 + 5
    expect(tempoRestanteOferta(segundos(-faltam))).toEqual({
      dias: 2,
      horas: 3,
      minutos: 4,
      segundos: 5,
    })
  })

  it('devolve null quando a oferta acabou', () => {
    expect(tempoRestanteOferta(segundos(1))).toBeNull()
  })
})
