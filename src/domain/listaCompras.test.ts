import { describe, expect, it } from 'vitest'
import { listaDeCompras } from './listaCompras'
import { ZERO, type Refeicao } from './nutricao'

const opcao = (nome: string, grupo: string, gramas: number) => ({
  tipo: 'alimento' as const,
  ref_id: nome,
  nome,
  grupo,
  medida: 'g',
  gramas_medida: 1,
  quantidade: gramas,
  gramas,
  nutrientes: ZERO,
})

const refeicao = (itens: ReturnType<typeof opcao>[][]): Refeicao => ({
  id: 'r',
  nome: 'Almoço',
  horario: '12:00',
  itens: itens.map((opcoes) => ({ opcoes })),
  texto: '',
  observacao: '',
  substitutas: [],
})

describe('lista de compras', () => {
  const refeicoes = [
    refeicao([
      [opcao('Arroz', 'Cereais e derivados', 100)],
      [opcao('Ovo', 'Ovos e derivados', 50)],
    ]),
    refeicao([
      [
        opcao('Arroz', 'Cereais e derivados', 50),
        opcao('Batata', 'Verduras, hortaliças e derivados', 80),
      ],
    ]),
  ]
  it('soma o mesmo alimento de várias refeições vezes os dias', () => {
    const lista = listaDeCompras(refeicoes, new Map(), 7)
    expect(lista.find((g) => g.grupo === 'Grãos')?.itens).toEqual([
      { nome: 'Arroz', quantidade: '1,1 kg' },
    ])
  })
  it('agrupa por categoria e ignora a substituição ("ou")', () => {
    const lista = listaDeCompras(refeicoes, new Map(), 3)
    expect(lista.map((g) => g.grupo)).toEqual(['Proteínas', 'Grãos'])
    expect(lista[0]?.itens[0]).toEqual({ nome: 'Ovo', quantidade: '150 g' })
  })
  it('14 dias dobra a semana', () => {
    expect(
      listaDeCompras(refeicoes, new Map(), 14).find((g) => g.grupo === 'Grãos')?.itens[0]
        ?.quantidade,
    ).toBe('2,1 kg')
  })
})
