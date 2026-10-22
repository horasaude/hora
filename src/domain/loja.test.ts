import { describe, expect, it } from 'vitest'
import { linkComCupom, ordemVitrine, percentualDesconto, precoComDesconto } from './loja'

describe('loja', () => {
  it('percentual de desconto arredonda para baixo', () => {
    expect(percentualDesconto(20000, 16000)).toBe(20)
    expect(percentualDesconto(9990, 8490)).toBe(15)
    expect(percentualDesconto(5000, 5000)).toBe(0)
  })
  it('preço final pelo percentual', () => {
    expect(precoComDesconto(20000, 20)).toBe(16000)
    expect(precoComDesconto(9990, 15)).toBe(8492)
    expect(precoComDesconto(100, 150)).toBe(1)
  })
  it('destaques primeiro, depois por nome', () => {
    const l = ordemVitrine([
      { nome: 'Whey', destaque: false },
      { nome: 'Creatina', destaque: true },
      { nome: 'Aveia', destaque: false },
    ])
    expect(l.map((x) => x.nome)).toEqual(['Creatina', 'Aveia', 'Whey'])
  })

  it('linkComCupom entra na loja com o cupom e volta para o produto', () => {
    expect(linkComCupom('https://loja.com.br/products/creatina?utm_source=ora', 'ALUNAORA')).toBe(
      'https://loja.com.br/discount/ALUNAORA?redirect=%2Fproducts%2Fcreatina%3Futm_source%3Dora',
    )
    expect(linkComCupom('https://loja.com.br/products/creatina', null)).toBe(
      'https://loja.com.br/products/creatina',
    )
    expect(linkComCupom('https://outra.com.br/p/123', 'ALUNAORA')).toBe(
      'https://outra.com.br/p/123',
    )
  })
})
