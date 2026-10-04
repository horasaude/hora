import { describe, expect, it } from 'vitest'
import { mascararTelefone, soDigitos } from './telefone'

describe('telefone', () => {
  it.each([
    ['', ''],
    ['9', '(9'],
    ['98', '(98'],
    ['989', '(98) 9'],
    ['9898765', '(98) 9876-5'],
    ['98987654', '(98) 9876-54'],
    ['9832345678', '(98) 3234-5678'],
    ['98987654321', '(98) 98765-4321'],
    ['989876543210000', '(98) 98765-4321'],
    ['(98) 98765-432a1', '(98) 98765-4321'],
  ])('mascara %s como %s', (entrada, saida) => {
    expect(mascararTelefone(entrada)).toBe(saida)
  })

  it('guarda só os dígitos', () => {
    expect(soDigitos('(98) 98765-4321')).toBe('98987654321')
  })
})
