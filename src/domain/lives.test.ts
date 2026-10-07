import { describe, expect, it } from 'vitest'
import { contagem, janelaDaLive } from './lives'

const inicio = new Date('2026-10-23T19:00:00-03:00')
const as = (hora: string) => new Date(`2026-10-23T${hora}:00-03:00`)

describe('janela da live', () => {
  it('fechada antes de 30 minutos', () => {
    expect(janelaDaLive(inicio, 60, as('18:29'))).toBe('antes')
  })
  it('abre 30 minutos antes e fica aberta até o fim', () => {
    expect(janelaDaLive(inicio, 60, as('18:30'))).toBe('aberta')
    expect(janelaDaLive(inicio, 60, as('19:45'))).toBe('aberta')
    expect(janelaDaLive(inicio, 60, as('20:00'))).toBe('aberta')
  })
  it('encerra depois da duração', () => {
    expect(janelaDaLive(inicio, 60, as('20:01'))).toBe('encerrada')
  })
})

describe('contagem regressiva', () => {
  it('dias, horas e minutos até o início', () => {
    expect(contagem(inicio, new Date('2026-10-21T17:30:00-03:00'))).toEqual({
      dias: 2,
      horas: 1,
      minutos: 30,
    })
  })
  it('zera quando começou', () => {
    expect(contagem(inicio, as('19:10'))).toEqual({ dias: 0, horas: 0, minutos: 0 })
  })
})
