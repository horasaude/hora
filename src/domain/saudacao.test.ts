import { describe, expect, it } from 'vitest'
import { saudacaoPorHora } from './saudacao'

describe('saudacaoPorHora', () => {
  it('troca às 5h, 12h e 18h', () => {
    expect(saudacaoPorHora(4)).toBe('Boa noite')
    expect(saudacaoPorHora(5)).toBe('Bom dia')
    expect(saudacaoPorHora(12)).toBe('Boa tarde')
    expect(saudacaoPorHora(18)).toBe('Boa noite')
  })
})
