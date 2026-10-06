import { describe, expect, it } from 'vitest'
import { grupoDeCompra, listaDeCompras } from './listaCompras'
import {
  macros,
  nutrientesDe,
  porPorcao,
  type Por100,
  totalCardapio,
  type Opcao,
  type Refeicao,
} from './nutricao'

const arroz: Por100 = { kcal: 123.53, proteina: 2.59, carboidrato: 25.81, gordura: 1, fibra: 2.75 }
const frango: Por100 = { kcal: 159, proteina: 32, carboidrato: null, gordura: 2.5, fibra: null }

const opcao = (
  nome: string,
  grupo: string,
  gramas: number,
  por100 = arroz,
  ref_id = nome,
): Opcao => ({
  tipo: 'alimento',
  ref_id,
  nome,
  grupo,
  medida: 'g',
  gramas_medida: 1,
  quantidade: gramas,
  gramas,
  nutrientes: nutrientesDe(por100, gramas),
})

const refeicao = (itens: Opcao[][]): Refeicao => ({
  id: 'r',
  nome: 'Almoço',
  horario: '12:00',
  itens: itens.map((opcoes) => ({ opcoes })),
  texto: '',
  observacao: '',
  substitutas: [],
})

describe('nutrição', () => {
  it('calcula pela quantidade em gramas; sem valor e negativo contam zero', () => {
    expect(nutrientesDe(arroz, 150).kcal).toBeCloseTo(185.3, 1)
    expect(nutrientesDe({ ...frango, carboidrato: -0.05 }, 100).carboidrato).toBe(0)
    expect(nutrientesDe(frango, 100).fibra).toBe(0)
  })
  it('total do dia conta só a opção principal de cada item (o "ou" não soma)', () => {
    const r = refeicao([
      [opcao('Arroz', 'Cereais e derivados', 100)],
      [
        opcao('Frango', 'Carnes e derivados', 120, frango),
        opcao('Carne', 'Carnes e derivados', 100, frango),
      ],
    ])
    expect(totalCardapio([r]).kcal).toBeCloseTo(123.53 + 190.8, 1)
  })
  it('macros em gramas e porcentagem das calorias (4, 4 e 9 kcal/g)', () => {
    const m = macros({ kcal: 0, proteina: 25, carboidrato: 50, gordura: 10, fibra: 0 })
    expect(m.proteina).toEqual({ gramas: 25, pct: 26 })
    expect(m.carboidrato.pct).toBe(51)
    expect(m.gordura.pct).toBe(23)
  })
  it('receita: soma dos ingredientes dividida pelas porções', () => {
    expect(porPorcao([{ por100: arroz, gramas: 200 }], 2).kcal).toBeCloseTo(123.53, 2)
  })
})

describe('lista de compras', () => {
  it('soma a semana por alimento e agrupa por tipo', () => {
    const r = refeicao([
      [opcao('Arroz', 'Cereais e derivados', 100)],
      [
        opcao('Frango', 'Carnes e derivados', 120, frango),
        opcao('Carne', 'Carnes e derivados', 100, frango),
      ],
      [opcao('Banana', 'Frutas e derivados', 100)],
    ])
    const lista = listaDeCompras([r, r], new Map())
    expect(lista.map((g) => g.grupo)).toEqual(['Hortifruti', 'Carnes e ovos', 'Grãos'])
    expect(lista.find((g) => g.grupo === 'Grãos')?.itens).toEqual([
      { nome: 'Arroz', quantidade: '1,4 kg' },
    ])
    expect(lista.find((g) => g.grupo === 'Carnes e ovos')?.itens).toEqual([
      { nome: 'Frango', quantidade: '1,7 kg' },
    ])
  })
  it('receita entra pelos ingredientes de cada porção', () => {
    const r = refeicao([
      [{ ...opcao('Omelete', '', 0), tipo: 'receita', ref_id: 'om', quantidade: 1 }],
    ])
    const lista = listaDeCompras(
      [r],
      new Map([['om', [{ nome: 'Ovo', grupo: 'Ovos e derivados', gramas: 100 }]]]),
    )
    expect(lista).toEqual([
      { grupo: 'Carnes e ovos', itens: [{ nome: 'Ovo', quantidade: '700 g' }] },
    ])
  })
  it('grupo desconhecido vai para Outros', () => {
    expect(grupoDeCompra('Bebidas (alcoólicas e não alcoólicas)')).toBe('Outros')
  })
})
