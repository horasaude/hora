import { describe, expect, it } from 'vitest'
import {
  diaDoDesafio,
  diasDoDesafio,
  diasSeguidos,
  faltaParaSubir,
  pontosDoGrafico,
  progressoMeta,
  somarDias,
  tomDaPosicao,
  ultimosSeteDias,
} from './engajamento'

describe('datas', () => {
  it('soma dias atravessando mês e ano', () => {
    expect(somarDias('2026-10-31', 1)).toBe('2026-11-01')
    expect(somarDias('2027-01-01', -1)).toBe('2026-12-31')
  })
})

describe('sequência', () => {
  it('conta até hoje quando hoje já teve check-in', () => {
    expect(
      diasSeguidos(['2026-10-06', '2026-10-05', '2026-10-04', '2026-10-01'], '2026-10-06'),
    ).toBe(3)
  })
  it('conta até ontem quando hoje ainda não teve', () => {
    expect(diasSeguidos(['2026-10-05', '2026-10-04'], '2026-10-06')).toBe(2)
  })
  it('zera quando ontem e hoje ficaram vazios', () => {
    expect(diasSeguidos(['2026-10-04'], '2026-10-06')).toBe(0)
  })
  it('marca os últimos 7 dias do mais antigo a hoje', () => {
    expect(ultimosSeteDias(['2026-10-06', '2026-09-30'], '2026-10-06')).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
      true,
    ])
  })
})

describe('ranking', () => {
  const lista = [
    { posicao: 1, apelido: 'flor', pontos: 120, eu: false },
    { posicao: 2, apelido: 'mari', pontos: 100, eu: true },
  ]
  it('falta um ponto a mais que a diferença para subir', () => {
    expect(faltaParaSubir(lista)).toBe(21)
  })
  it('primeira colocada não tem para onde subir', () => {
    expect(faltaParaSubir([{ ...lista[1]!, posicao: 1 }])).toBeNull()
  })
  it('cores das posições', () => {
    expect([1, 2, 3, 4].map(tomDaPosicao)).toEqual(['dourado', 'prata', 'coral', 'cinza'])
  })
})

describe('desafio', () => {
  it('lista os dias do período', () => {
    expect(diasDoDesafio('2026-10-30', '2026-11-02')).toEqual([
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
      '2026-11-02',
    ])
  })
  it('dia do desafio fica dentro do período', () => {
    expect(diaDoDesafio('2026-10-01', '2026-10-21', '2026-10-15')).toBe(15)
    expect(diaDoDesafio('2026-10-01', '2026-10-21', '2026-11-15')).toBe(21)
  })
  it('progresso não passa de 100', () => {
    expect(progressoMeta(15, 21)).toBe(71)
    expect(progressoMeta(30, 21)).toBe(100)
  })
})

describe('gráfico', () => {
  it('menor valor embaixo e maior em cima', () => {
    const p = pontosDoGrafico([80, 70], 100, 50, 10)
    expect(p).toEqual([
      { x: 10, y: 10 },
      { x: 90, y: 40 },
    ])
  })
  it('um só registro fica no meio', () => {
    expect(pontosDoGrafico([70], 100, 50, 10)[0]?.x).toBe(50)
  })
})
