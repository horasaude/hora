import { describe, expect, it } from 'vitest'
import type { Medida } from '../api/medidas.api'
import { variacao } from './useVariacao'

const m = (dia: string, peso: number | null, cintura: number | null = null): Medida => ({
  id: dia,
  dia,
  foto_path: null,
  peso,
  cintura,
  quadril: null,
  braco: null,
  coxa: null,
})

describe('variacao', () => {
  it('compara o registro mais novo com o mais antigo (lista do mais novo ao mais antigo)', () => {
    const lista = [m('2026-10-20', 70.1, 80), m('2026-10-10', null, 82), m('2026-10-01', 72.5, 84)]
    expect(variacao(lista, 'peso')).toBe(-2.4)
    expect(variacao(lista, 'cintura')).toBe(-4)
  })
  it('sem dois registros da medida, não há variação', () => {
    expect(variacao([m('2026-10-20', 70)], 'peso')).toBeNull()
    expect(variacao([m('2026-10-20', 70), m('2026-10-01', null)], 'peso')).toBeNull()
  })
})
