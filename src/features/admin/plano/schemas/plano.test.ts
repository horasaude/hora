import { describe, expect, it } from 'vitest'
import { esquemaAlimento, lerLista, lerRefeicoes } from './plano'

describe('formatos do plano alimentar', () => {
  it('refeições fora do formato viram lista vazia', () => {
    expect(lerRefeicoes({})).toEqual([])
    expect(lerRefeicoes([{ nome: 'sem campos' }])).toEqual([])
    expect(
      lerLista([{ grupo: 'Grãos', itens: [{ nome: 'Arroz', quantidade: '1 kg' }] }]),
    ).toHaveLength(1)
  })
  it('alimento aceita vírgula, deixa vazio como sem valor e exige gramas da medida', () => {
    const base = {
      nome: 'Pão',
      grupo: '',
      kcal: '300,5',
      proteina: '',
      carboidrato: '50',
      gordura: '3',
      fibra: '',
    }
    const ok = esquemaAlimento.parse({ ...base, medidas: [{ nome: '1 unidade', gramas: '50' }] })
    expect(ok.kcal).toBe(300.5)
    expect(ok.proteina).toBeNull()
    expect(
      esquemaAlimento.safeParse({ ...base, medidas: [{ nome: '1 unidade', gramas: '0' }] }).success,
    ).toBe(false)
  })
})
