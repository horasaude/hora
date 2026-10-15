import { describe, expect, it } from 'vitest'
import { horaBrasilia, mensagemLive } from './live'

describe('lembrete da live', () => {
  it('hora em Brasília, com minutos só quando tem', () => {
    expect(horaBrasilia('2026-10-15T22:00:00Z')).toBe('19h')
    expect(horaBrasilia('2026-10-15T22:30:00Z')).toBe('19h30')
  })
  it('título com a hora e o tema', () => {
    expect(mensagemLive('Sono e fome', '2026-10-15T22:00:00Z').title).toBe(
      'Live às 19h: Sono e fome',
    )
  })
})
