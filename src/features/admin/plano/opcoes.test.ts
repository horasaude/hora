import { describe, expect, it } from 'vitest'
import type { Alimento } from './api/alimentos.api'
import { comQuantidade, mover, opcaoDeAlimento, rotuloOpcao } from './opcoes'

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
  it('mudar a quantidade ao editar recalcula gramas e nutrientes na proporção', () => {
    const o = comQuantidade(opcaoDeAlimento(arroz, { nome: '1 colher de sopa', gramas: 25 }, 4), 2)
    expect(o.gramas).toBe(50)
    expect(o.nutrientes.kcal).toBeCloseTo(61.765, 2)
  })
  it('reordenar leva a linha para a nova posição e ignora posição fora da lista', () => {
    expect(mover(['pão', 'ovo', 'café'], 2, 0)).toEqual(['café', 'pão', 'ovo'])
    expect(mover(['pão', 'ovo'], 1, 2)).toEqual(['pão', 'ovo'])
  })
})

describe('busca', () => {
  it('cada palavra vira um trecho, sem acento, vírgula nem curinga', async () => {
    const { palavrasBusca } = await import('./api/alimentos.api')
    expect(palavrasBusca('Frango,  Peito%')).toEqual(['%frango%', '%peito%'])
    expect(palavrasBusca('feijão')).toEqual(['%feijao%'])
  })
})
