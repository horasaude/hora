import { describe, expect, it } from 'vitest'
import { cpfValido } from './cpf'

describe('cpfValido', () => {
  it.each(['529.982.247-25', '52998224725', '111.444.777-35'])('aceita %s', (cpf) => {
    expect(cpfValido(cpf)).toBe(true)
  })

  it.each(['529.982.247-26', '111.111.111-11', '1234567890', ''])('recusa %s', (cpf) => {
    expect(cpfValido(cpf)).toBe(false)
  })
})
