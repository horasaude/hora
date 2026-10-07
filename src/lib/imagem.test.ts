import { describe, expect, it } from 'vitest'
import { medidaReduzida } from './imagem'

describe('medidaReduzida', () => {
  it('reduz pelo lado maior e mantém a proporção', () => {
    expect(medidaReduzida(4000, 3000, 1200)).toEqual({ largura: 1200, altura: 900 })
    expect(medidaReduzida(1000, 2000, 1200)).toEqual({ largura: 600, altura: 1200 })
  })
  it('não aumenta imagem pequena', () => {
    expect(medidaReduzida(800, 600, 1200)).toEqual({ largura: 800, altura: 600 })
  })
})
