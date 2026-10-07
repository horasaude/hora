import { describe, expect, it } from 'vitest'
import { diaAtual } from './dia'

const em = (iso: string) => new Date(iso)

describe('diaAtual', () => {
  const adesao = em('2026-10-05T14:00:00-03:00')
  it('é o dia 1 no dia da adesão, até 23h59', () => {
    expect(diaAtual(adesao, em('2026-10-05T14:00:00-03:00'))).toBe(1)
    expect(diaAtual(adesao, em('2026-10-05T23:59:59-03:00'))).toBe(1)
  })
  it('vira à meia-noite de Brasília, não a cada 24 h', () => {
    expect(diaAtual(adesao, em('2026-10-06T00:00:00-03:00'))).toBe(2)
    expect(diaAtual(em('2026-10-05T23:59:00-03:00'), em('2026-10-06T00:01:00-03:00'))).toBe(2)
  })
  it('meia-noite em UTC ainda não muda o dia em Brasília', () => {
    expect(diaAtual(adesao, em('2026-10-06T01:30:00Z'))).toBe(1)
  })
  it('dia 7, dia 8 e dia 31', () => {
    expect(diaAtual(adesao, em('2026-10-11T08:00:00-03:00'))).toBe(7)
    expect(diaAtual(adesao, em('2026-10-12T00:00:00-03:00'))).toBe(8)
    expect(diaAtual(adesao, em('2026-11-04T12:00:00-03:00'))).toBe(31)
  })
})
