import { describe, expect, it } from 'vitest'
import { estadoOferta, ofertaOraDisponivel } from './oferta'

describe('oferta do ORA (só no dia 24/10, horário de Brasília)', () => {
  it('não vale às 23h59 de 23/10', () => {
    expect(estadoOferta(new Date('2026-10-24T02:59:00Z'))).toBe('antes')
    expect(ofertaOraDisponivel(new Date('2026-10-24T02:59:00Z'))).toBe(false)
  })
  it('começa à 00h00 de 24/10', () => {
    expect(estadoOferta(new Date('2026-10-24T03:00:00Z'))).toBe('durante')
  })
  it('vale às 23h59 de 24/10', () => {
    expect(ofertaOraDisponivel(new Date('2026-10-25T02:59:00Z'))).toBe(true)
  })
  it('não vale às 00h01 de 25/10', () => {
    expect(estadoOferta(new Date('2026-10-25T03:01:00Z'))).toBe('depois')
    expect(ofertaOraDisponivel(new Date('2026-10-25T03:01:00Z'))).toBe(false)
  })
  it('hoje (início de outubro) ainda é antes da oferta', () => {
    expect(estadoOferta(new Date('2026-10-06T12:00:00Z'))).toBe('antes')
  })
})
