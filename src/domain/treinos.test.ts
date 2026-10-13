import { describe, expect, it } from 'vitest'
import { diaDaSemanaBrasilia, progressoDoTreino, semanaDe, treinoDeHoje } from './treinos'

const rotina = [
  { dia_semana: 1, treino: 'A' },
  { dia_semana: 3, treino: 'B' },
  { dia_semana: 5, treino: 'C' },
]

describe('treino de hoje', () => {
  it('segunda é o treino A, quarta o B', () => {
    expect(treinoDeHoje(rotina, 1).hoje?.treino).toBe('A')
    expect(treinoDeHoje(rotina, 3).hoje?.treino).toBe('B')
  })

  it('dia sem treino é descanso e mostra o próximo', () => {
    expect(treinoDeHoje(rotina, 2)).toEqual({ hoje: null, proximo: rotina[1] })
    expect(treinoDeHoje(rotina, 6).proximo?.treino).toBe('A')
    expect(treinoDeHoje(rotina, 0).proximo?.treino).toBe('A')
  })

  it('sem rotina, nada', () => {
    expect(treinoDeHoje([], 2)).toEqual({ hoje: null, proximo: null })
  })

  it('o dia da semana vira à meia-noite de Brasília', () => {
    expect(diaDaSemanaBrasilia(new Date('2026-10-19T02:59:00Z'))).toBe(0)
    expect(diaDaSemanaBrasilia(new Date('2026-10-19T03:00:00Z'))).toBe(1)
  })

  it('a semana vai de domingo a sábado', () => {
    const s = semanaDe(new Date('2026-10-21T15:00:00Z'))
    expect(s[0]).toBe('2026-10-18')
    expect(s[6]).toBe('2026-10-24')
  })
})

describe('progresso do treino', () => {
  it('conta as séries marcadas sobre o total', () => {
    expect(progressoDoTreino({ '0': 3, '1': 1 }, [3, 3])).toBe(67)
    expect(progressoDoTreino({ '0': 9 }, [3, 3])).toBe(50)
    expect(progressoDoTreino({}, [])).toBe(0)
  })
})
