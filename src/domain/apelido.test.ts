import { describe, expect, it } from 'vitest'
import { APELIDO_VALIDO, normalizarApelido } from './apelido'

describe('normalizarApelido', () => {
  it('troca espaço por ponto e tira o @ e as pontas', () => {
    expect(normalizarApelido('  Laís Moraes ')).toBe('Laís.Moraes')
    expect(normalizarApelido('@mari')).toBe('mari')
    expect(normalizarApelido('ana   clara')).toBe('ana.clara')
  })
  it('o resultado passa na regra quando só tinha letras e espaço', () => {
    expect(APELIDO_VALIDO.test(normalizarApelido('Laís Moraes'))).toBe(true)
    expect(APELIDO_VALIDO.test(normalizarApelido('mari!'))).toBe(false)
  })
})
