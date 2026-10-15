import { describe, expect, it } from 'vitest'
import { esquemaApelido } from './apelido'

describe('esquemaApelido', () => {
  it('aceita apelidos do ranking', () => {
    for (const a of ['mari', 'flor.de.lis', 'julia_fit', 'Lú-2']) {
      expect(esquemaApelido.safeParse(a).success).toBe(true)
    }
  })
  it('espaço vira ponto e o @ sai', () => {
    expect(esquemaApelido.parse('mari silva')).toBe('mari.silva')
    expect(esquemaApelido.parse('@lais')).toBe('lais')
  })
  it('recusa curto, longo e símbolo', () => {
    for (const a of ['m', 'a'.repeat(21), 'mari!', 'mari#1']) {
      expect(esquemaApelido.safeParse(a).success).toBe(false)
    }
  })
})
