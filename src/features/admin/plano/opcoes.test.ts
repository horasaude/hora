import { describe, expect, it } from 'vitest'
import type { Alimento } from './api/alimentos.api'
import { opcaoDeAlimento, rotuloOpcao } from './opcoes'

const arroz = {
  id: 'a1',
  nome: 'Arroz, integral, cozido',
  grupo: 'Cereais e derivados',
  kcal: 123.53,
  proteina: 2.59,
  carboidrato: 25.81,
  gordura: 1,
  fibra: 2.75,
} as Alimento

describe('opções de item', () => {
  it('medida caseira vezes a quantidade dá as gramas e os nutrientes', () => {
    const o = opcaoDeAlimento(arroz, { nome: '1 colher de sopa', gramas: 25 }, 4)
    expect(o.gramas).toBe(100)
    expect(o.nutrientes.kcal).toBeCloseTo(123.53, 2)
    expect(rotuloOpcao(o)).toBe('4 x 1 colher de sopa (100 g)')
  })
  it('sem medida, a quantidade é em gramas', () => {
    expect(rotuloOpcao(opcaoDeAlimento(arroz, null, 150))).toBe('150 g')
  })
})

describe('busca', () => {
  it('cada palavra vira um trecho, sem acento, vírgula nem curinga', async () => {
    const { palavrasBusca } = await import('./api/alimentos.api')
    expect(palavrasBusca('Frango,  Peito%')).toEqual(['%frango%', '%peito%'])
    expect(palavrasBusca('feijão')).toEqual(['%feijao%'])
  })
})
