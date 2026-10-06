import { describe, expect, it } from 'vitest'
import { deCampoBrasilia, diaEmBrasilia, formatarDataHora, paraCampoBrasilia } from './datas'

describe('diaEmBrasilia', () => {
  it('23h50 em Brasília continua no mesmo dia, mesmo já sendo o dia seguinte em UTC', () => {
    expect(diaEmBrasilia(new Date('2026-10-25T02:50:00Z'))).toBe('2026-10-24')
  })
  it('00h10 em Brasília já é o dia seguinte', () => {
    expect(diaEmBrasilia(new Date('2026-10-25T03:10:00Z'))).toBe('2026-10-25')
  })
})

describe('campo de data e hora em Brasília', () => {
  it('ida e volta mantém o mesmo instante', () => {
    const instante = new Date('2026-10-24T22:00:00Z')
    expect(paraCampoBrasilia(instante)).toBe('2026-10-24T19:00')
    expect(deCampoBrasilia('2026-10-24T19:00')?.toISOString()).toBe('2026-10-24T22:00:00.000Z')
  })

  it('valor inválido devolve null', () => {
    expect(deCampoBrasilia('')).toBeNull()
    expect(deCampoBrasilia('24/10/2026 19:00')).toBeNull()
  })

  it('formata data e hora curtas', () => {
    expect(formatarDataHora(new Date('2026-10-24T22:00:00Z'))).toBe('24/10/2026, 19:00')
  })
})
