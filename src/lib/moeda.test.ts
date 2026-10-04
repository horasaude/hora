import { expect, it } from 'vitest'
import { formatarCentavos, formatarPreco } from './moeda'

const limpo = (t: string) => t.replace(/\s/g, ' ')

it('formata centavos em reais', () => {
  expect(limpo(formatarCentavos(19700))).toBe('R$ 197,00')
})

it('preço de vitrine tira o ,00 só de valor redondo', () => {
  expect(limpo(formatarPreco(199700))).toBe('R$ 1.997')
  expect(limpo(formatarPreco(19850))).toBe('R$ 198,50')
})
