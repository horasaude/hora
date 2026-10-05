import { describe, expect, it } from 'vitest'
import { mascararCpf } from './cpf'

describe('mascararCpf', () => {
  it.each([
    ['', ''],
    ['529', '529'],
    ['5299', '529.9'],
    ['5299822', '529.982.2'],
    ['52998224725', '529.982.247-25'],
    ['529982247259999', '529.982.247-25'],
    ['529.982.247-25', '529.982.247-25'],
  ])('%s vira %s', (entrada, saida) => {
    expect(mascararCpf(entrada)).toBe(saida)
  })
})
