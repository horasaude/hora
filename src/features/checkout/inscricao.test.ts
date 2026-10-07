import { beforeEach, describe, expect, it } from 'vitest'
import { lerInscricao, salvarInscricao } from './inscricao'

describe('inscricao', () => {
  beforeEach(() => sessionStorage.clear())

  it('guarda e lê o que veio do popup', () => {
    const dados = {
      plano: 'pix' as const,
      nome: 'Maria',
      email: 'm@t.com',
      whatsapp: '98987654321',
    }
    salvarInscricao(dados)
    expect(lerInscricao()).toEqual(dados)
  })

  it('sem nada guardado ou com dado estranho, devolve null', () => {
    expect(lerInscricao()).toBeNull()
    sessionStorage.setItem('ora:inscricao', '{"plano":"anual"}')
    expect(lerInscricao()).toBeNull()
  })
})
