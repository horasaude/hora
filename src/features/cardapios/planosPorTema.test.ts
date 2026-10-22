import { describe, expect, it } from 'vitest'
import type { Cardapio } from './api/cardapios.api'
import { planosPorTema } from './planosPorTema'

const plano = (id: string, tema_id: string | null): Cardapio => ({
  id,
  tema_id,
  objetivo: id,
  titulo: id,
  descricao: '',
  texto: false,
  refeicoes: [],
  pdf_path: null,
})

describe('planosPorTema', () => {
  const temas = [
    { id: 't1', titulo: 'Detox' },
    { id: 't2', titulo: 'Arrancada' },
    { id: 't3', titulo: 'Sem plano' },
  ]

  it('junta vários planos do mesmo tema, na ordem dos temas', () => {
    const g = planosPorTema([plano('b', 't2'), plano('a', 't1'), plano('c', 't2')], temas)
    expect(g.map((x) => x.titulo)).toEqual(['Detox', 'Arrancada'])
    expect(g[1]?.planos.map((p) => p.id)).toEqual(['b', 'c'])
  })

  it('deixa sem tema e tema desconhecido no fim, sem título', () => {
    const g = planosPorTema([plano('x', null), plano('y', 'outro'), plano('a', 't1')], temas)
    expect(g.at(-1)).toMatchObject({ temaId: null, titulo: null })
    expect(g.at(-1)?.planos.map((p) => p.id)).toEqual(['x', 'y'])
  })
})
