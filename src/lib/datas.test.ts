import { describe, expect, it } from 'vitest'
import {
  deCampoBrasilia,
  diaEMes,
  diaEmBrasilia,
  diaSemanaEHora,
  formatarDataHora,
  horaEmBrasilia,
  paraCampoBrasilia,
  quandoFoi,
} from './datas'

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

describe('formatos da área da aluna', () => {
  it('hora, dia da semana e dia/mês no horário de Brasília', () => {
    const quinta19h = new Date('2026-10-15T22:00:00Z')
    expect(horaEmBrasilia(quinta19h)).toBe(19)
    expect(diaSemanaEHora(quinta19h)).toBe('quinta, 19h')
    expect(diaSemanaEHora(new Date('2026-10-17T22:30:00Z'))).toBe('sábado, 19h30')
    expect(diaEMes(quinta19h)).toBe('15/10')
  })
})

describe('quandoFoi', () => {
  const agora = new Date('2026-10-20T15:00:00Z')
  it('conta os dias pelo calendário de Brasília', () => {
    expect(quandoFoi(new Date('2026-10-20T12:30:00Z'), agora)).toBe('hoje, 09:30')
    expect(quandoFoi(new Date('2026-10-20T02:00:00Z'), agora)).toBe('ontem, 23:00')
    expect(quandoFoi(new Date('2026-10-15T12:00:00Z'), agora)).toBe('há 5 dias')
  })
})
