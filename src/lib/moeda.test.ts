import { expect, it } from 'vitest'
import { formatarCentavos } from './moeda'

it('formata centavos em reais', () => {
  expect(formatarCentavos(19700).replace(/\s/g, ' ')).toBe('R$ 197,00')
})
