import { describe, expect, it } from 'vitest'
import { dentroDoArrependimento, tipoDeCancelamento } from './cancelamento.ts'

const aprovado = new Date('2026-10-24T15:00:00Z')
const depois = (horas: number) => new Date(aprovado.getTime() + horas * 3_600_000)

describe('cancelamento', () => {
  it('estorna até 7 dias da aprovação', () => {
    expect(dentroDoArrependimento(aprovado, depois(1))).toBe(true)
    expect(dentroDoArrependimento(aprovado, depois(7 * 24 - 1))).toBe(true)
    expect(tipoDeCancelamento(aprovado, depois(24))).toBe('arrependimento')
  })

  it('depois dos 7 dias só deixa de renovar', () => {
    expect(dentroDoArrependimento(aprovado, depois(7 * 24))).toBe(false)
    expect(tipoDeCancelamento(aprovado, depois(30 * 24))).toBe('nao_renovar')
  })
})
