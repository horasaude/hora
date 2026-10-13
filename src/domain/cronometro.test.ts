import { describe, expect, it } from 'vitest'
import { descansoAcabou, formatarTempo, iniciarDescanso, restanteDescanso } from './cronometro'

describe('cronômetro de descanso', () => {
  it('conta para trás a partir do descanso do exercício', () => {
    const d = iniciarDescanso(60, 0)!
    expect(restanteDescanso(d, 0)).toBe(60)
    expect(restanteDescanso(d, 15_400)).toBe(45)
    expect(descansoAcabou(d, 59_000)).toBe(false)
  })

  it('termina no zero e nunca fica negativo', () => {
    const d = iniciarDescanso(30, 1000)!
    expect(restanteDescanso(d, 31_000)).toBe(0)
    expect(restanteDescanso(d, 99_000)).toBe(0)
    expect(descansoAcabou(d, 31_000)).toBe(true)
  })

  it('sem descanso, não abre cronômetro', () => {
    expect(iniciarDescanso(0, 0)).toBeNull()
  })

  it('mostra minutos e segundos', () => {
    expect(formatarTempo(65)).toBe('1:05')
    expect(formatarTempo(30)).toBe('0:30')
  })
})
