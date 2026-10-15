import { describe, expect, it } from 'vitest'
import { combinarComProximo, letraCombinado, parceiros, separar } from './combinados'

const l = (...g: (number | null)[]) => g.map((combinado) => ({ combinado }))

describe('combinados', () => {
  it('letra e parceiros pelos vizinhos do mesmo grupo', () => {
    const itens = l(null, 1, 1, 1, null)
    expect(letraCombinado(itens, 1)).toBe('A')
    expect(letraCombinado(itens, 3)).toBe('C')
    expect(letraCombinado(itens, 0)).toBeNull()
    expect(parceiros(itens, 2)).toEqual([1, 3])
  })
  it('combinar com o próximo cria grupo novo ou aumenta o que existe', () => {
    expect(combinarComProximo(l(null, null, 1, 1), 0).map((x) => x.combinado)).toEqual([2, 2, 1, 1])
    expect(combinarComProximo(l(1, 1, null), 1).map((x) => x.combinado)).toEqual([1, 1, 1])
    expect(combinarComProximo(l(null, null), 1).map((x) => x.combinado)).toEqual([null, null])
  })
  it('separar solta o exercício e o parceiro que ficaria sozinho', () => {
    expect(separar(l(1, 1), 0).map((x) => x.combinado)).toEqual([null, null])
    expect(separar(l(1, 1, 1), 2).map((x) => x.combinado)).toEqual([1, 1, null])
  })
})
