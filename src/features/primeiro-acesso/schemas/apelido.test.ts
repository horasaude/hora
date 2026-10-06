import { describe, expect, it } from 'vitest'
import { esquemaApelido } from './apelido'

describe('esquemaApelido', () => {
  it('aceita apelidos do ranking', () => {
    for (const a of ['mari', 'flor.de.lis', 'julia_fit', 'Lú-2']) {
      expect(esquemaApelido.safeParse(a).success).toBe(true)
    }
  })
  it('recusa curto, longo, espaço e símbolo', () => {
    for (const a of ['m', 'a'.repeat(21), 'mari silva', 'mari!']) {
      expect(esquemaApelido.safeParse(a).success).toBe(false)
    }
  })
})
