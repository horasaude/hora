import { describe, expect, it } from 'vitest'
import type { ItemRecebe } from '../textos'
import { itensVisiveis } from './itensRecebe'

const itens: ItemRecebe[] = [
  { texto: 'Lives' },
  { texto: '13º mês', bonus: true, so: 'oferta' },
  { texto: 'Loja', bonus: true, so: 'lojaParceira' },
]
const textosDe = (l: ItemRecebe[]) => l.map((i) => i.texto)

describe('itensVisiveis', () => {
  it('na oferta mostra o 13º mês e esconde a loja com a flag desligada', () => {
    expect(textosDe(itensVisiveis(itens, true, false))).toEqual(['Lives', '13º mês'])
  })

  it('depois da oferta o 13º mês some', () => {
    expect(textosDe(itensVisiveis(itens, false, false))).toEqual(['Lives'])
  })

  it('com a flag ligada a loja aparece', () => {
    expect(textosDe(itensVisiveis(itens, false, true))).toEqual(['Lives', 'Loja'])
  })
})
