import { describe, expect, it } from 'vitest'
import { esquemaMedida, lerDecimal, mascaraDecimal } from './medida.schema'

const base = {
  dia: '2026-10-06',
  peso: '',
  cintura: '',
  quadril: '',
  braco: '',
  coxa: '',
  arquivo: null,
}

describe('medidas', () => {
  it('máscara com vírgula e uma casa', () => {
    expect(mascaraDecimal('72.45')).toBe('72,4')
    expect(mascaraDecimal('8a0')).toBe('80')
  })
  it('lê decimal brasileiro', () => {
    expect(lerDecimal('72,4')).toBe(72.4)
    expect(lerDecimal('')).toBeNull()
  })
  it('pede pelo menos uma medida', () => {
    expect(esquemaMedida('2026-10-06').safeParse(base).success).toBe(false)
    expect(esquemaMedida('2026-10-06').safeParse({ ...base, cintura: '80' }).success).toBe(true)
  })
  it('recusa data futura e valor fora do limite', () => {
    expect(
      esquemaMedida('2026-10-06').safeParse({ ...base, peso: '70', dia: '2026-10-07' }).success,
    ).toBe(false)
    expect(esquemaMedida('2026-10-06').safeParse({ ...base, peso: '7' }).success).toBe(false)
  })
})
