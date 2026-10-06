import { describe, expect, it } from 'vitest'
import { intervaloDoMes } from './pontos.api'

describe('intervaloDoMes', () => {
  it('vai do dia 1 ao dia 1 do mês seguinte, virando o ano em dezembro', () => {
    expect(intervaloDoMes('2026-10')).toEqual(['2026-10-01', '2026-11-01'])
    expect(intervaloDoMes('2026-12')).toEqual(['2026-12-01', '2027-01-01'])
  })
})
