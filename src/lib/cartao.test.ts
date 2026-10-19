import { describe, expect, it } from 'vitest'
import {
  cartaoValido,
  lerValidade,
  mascararCartao,
  mascararCep,
  mascararValidade,
  validadeValida,
} from './cartao'

describe('cartão', () => {
  it('formata enquanto digita', () => {
    expect(mascararCartao('5162306219378829')).toBe('5162 3062 1937 8829')
    expect(mascararValidade('0829')).toBe('08/29')
    expect(mascararValidade('0')).toBe('0')
    expect(mascararCep('65000123')).toBe('65000-123')
  })

  it('confere o dígito verificador', () => {
    expect(cartaoValido('5162 3062 1937 8829')).toBe(true)
    expect(cartaoValido('5162 3062 1937 8828')).toBe(false)
    expect(cartaoValido('4111')).toBe(false)
  })

  it('lê e confere a validade', () => {
    const hoje = new Date(2026, 9, 19)
    expect(lerValidade('08/29')).toEqual({ mes: 8, ano: 2029 })
    expect(lerValidade('13/29')).toBeNull()
    expect(validadeValida('10/26', hoje)).toBe(true)
    expect(validadeValida('09/26', hoje)).toBe(false)
  })
})
