import { describe, expect, it } from 'vitest'
import { mensagemAgua } from './agua'

describe('mensagemAgua', () => {
  it('sem nada bebido, chama para começar', () => {
    expect(mensagemAgua(0, 3000).body).toBe('Comece agora: a meta de hoje é 3 L.')
  })
  it('com água bebida, mostra quanto falta', () => {
    expect(mensagemAgua(1250, 3000).body).toBe('Você já bebeu 1,3 L. Faltam 1,8 L para a meta.')
    expect(mensagemAgua(500, 2000).body).toBe('Você já bebeu 500 ml. Faltam 1,5 L para a meta.')
  })
})
