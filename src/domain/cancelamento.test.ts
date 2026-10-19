import { describe, expect, it } from 'vitest'
import { dentroDoArrependimento as servidor } from '../../supabase/functions/_shared/pagamento/cancelamento'
import { dentroDoArrependimento } from './cancelamento'

describe('cancelamento na tela', () => {
  it('bate com a conta do servidor', () => {
    const aprovado = new Date('2026-10-24T15:00:00Z')
    for (const horas of [0, 24, 167, 168, 169, 720]) {
      const agora = new Date(aprovado.getTime() + horas * 3_600_000)
      expect(dentroDoArrependimento(aprovado, agora)).toBe(servidor(aprovado, agora))
    }
  })
})
