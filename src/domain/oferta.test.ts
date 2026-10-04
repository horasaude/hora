import { describe, expect, it } from 'vitest'
import { ofertaOraDisponivel } from './oferta'

describe('ofertaOraDisponivel', () => {
  it('vale às 23h59 de 24/10 em Brasília', () => {
    expect(ofertaOraDisponivel(new Date('2026-10-25T02:59:00Z'))).toBe(true)
  })
  it('não vale às 00h01 de 25/10 em Brasília', () => {
    expect(ofertaOraDisponivel(new Date('2026-10-25T03:01:00Z'))).toBe(false)
  })
})
