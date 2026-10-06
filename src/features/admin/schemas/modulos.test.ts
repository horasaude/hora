import { describe, expect, it } from 'vitest'
import { esquemaDesafio } from './modulos'

const base = {
  nome: '21 dias de água em dia',
  descricao: '',
  inicio: '2026-11-01',
  fim: '2026-11-21',
  tipo_checkin: 'numero' as const,
  unidade: 'copos',
  meta_diaria: '8',
  meta_dias: '21',
  pontos_por_dia: '10',
  bonus_conclusao: '100',
  premio: 'Caixa surpresa',
  publico: 'todas' as const,
}

describe('esquemaDesafio', () => {
  it('desafio de número guarda unidade e meta por dia', () => {
    expect(esquemaDesafio.parse(base)).toMatchObject({
      unidade: 'copos',
      meta_diaria: 8,
      meta_dias: 21,
      pontos_por_dia: 10,
    })
  })
  it('sim ou não descarta unidade e meta por dia', () => {
    expect(esquemaDesafio.parse({ ...base, tipo_checkin: 'sim_nao' })).toMatchObject({
      unidade: null,
      meta_diaria: null,
    })
  })
  it('recusa fim antes do início, meta maior que o período e número sem meta diária', () => {
    expect(esquemaDesafio.safeParse({ ...base, fim: '2026-10-31' }).success).toBe(false)
    expect(esquemaDesafio.safeParse({ ...base, meta_dias: '22' }).success).toBe(false)
    expect(esquemaDesafio.safeParse({ ...base, meta_diaria: '' }).success).toBe(false)
  })
})
