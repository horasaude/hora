import { describe, expect, it } from 'vitest'
import { FIM_OFERTA_ORA, INICIO_OFERTA_ORA } from './oferta'
import {
  contagemOferta,
  descontoOferta,
  DESCONTO_OFERTA_CENTAVOS,
  precosPara,
  precosVigentes,
} from './precos'

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

describe('antes do dia do evento', () => {
  it('vale o preço cheio, sem âncora e com 12 meses', () => {
    const p = precosVigentes(new Date(INICIO_OFERTA_ORA.getTime() - 1000))
    expect(p.emOferta).toBe(false)
    expect(p.parceladoCentavos).toBe(22700)
    expect(p.ancoraCentavos).toBeNull()
    expect(p.mesesAcesso).toBe(12)
  })
})

describe('contagemOferta', () => {
  it('antes do dia, conta até a oferta começar', () => {
    const faltam = 2 * 86400 + 3 * 3600 + 4 * 60 + 5
    expect(contagemOferta(new Date(INICIO_OFERTA_ORA.getTime() - faltam * 1000))).toEqual({
      estado: 'antes',
      tempo: { dias: 2, horas: 3, minutos: 4, segundos: 5 },
    })
  })

  it('no dia, conta até a oferta acabar', () => {
    expect(contagemOferta(segundos(-90))).toEqual({
      estado: 'durante',
      tempo: { dias: 0, horas: 0, minutos: 1, segundos: 30 },
    })
  })

  it('depois do dia, não há contagem', () => {
    expect(contagemOferta(segundos(1))).toBeNull()
  })
})

describe('preços vindos da configuração', () => {
  const c = {
    cheio: { pix: 300000, parcelado: 30000, recorrente: 32000 },
    oferta: { pix: 250000, parcelado: 25000, recorrente: 27000 },
    ofertaInicio: new Date('2026-11-01T03:00:00Z'),
    ofertaFim: new Date('2026-11-02T02:59:59Z'),
  }
  it('usa a tabela e a janela configuradas', () => {
    expect(precosVigentes(new Date('2026-10-24T15:00:00Z'), c).pixCentavos).toBe(300000)
    const noDia = precosVigentes(new Date('2026-11-01T15:00:00Z'), c)
    expect(noDia).toMatchObject({
      emOferta: true,
      pixCentavos: 250000,
      ancoraCentavos: 300000,
      mesesAcesso: 13,
    })
    expect(descontoOferta(c)).toBe(50000)
    expect(contagemOferta(new Date('2026-11-01T15:00:00Z'), c)?.estado).toBe('durante')
  })
})
