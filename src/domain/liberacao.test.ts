import { describe, expect, it } from 'vitest'
import { iniciosDosTemas, liberacaoPara, modoDe } from './liberacao'

const agora = new Date('2026-10-20T12:00:00Z')

describe('liberação de conteúdo', () => {
  it('lê o modo: bloqueado, data futura, data passada e aberto', () => {
    expect(modoDe({ bloqueado: true, libera_em: null }, agora)).toBe('breve')
    expect(modoDe({ bloqueado: false, libera_em: '2026-10-25T22:00:00Z' }, agora)).toBe('data')
    expect(modoDe({ bloqueado: false, libera_em: '2026-10-19T22:00:00Z' }, agora)).toBe('aberta')
    expect(modoDe({ bloqueado: false, libera_em: null }, agora)).toBe('aberta')
  })

  it('monta as colunas do banco para cada modo', () => {
    const quando = new Date('2026-10-25T22:00:00Z')
    expect(liberacaoPara('breve', quando)).toEqual({ bloqueado: true, libera_em: null })
    expect(liberacaoPara('data', quando)).toEqual({
      bloqueado: false,
      libera_em: '2026-10-25T22:00:00.000Z',
    })
    expect(liberacaoPara('aberta', quando)).toEqual({ bloqueado: false, libera_em: null })
    expect(liberacaoPara('data', null)).toEqual({ bloqueado: false, libera_em: null })
  })
})

describe('início de cada tema', () => {
  it('Detox no dia 1 por 7 dias, depois um tema a cada 30; rascunho não conta', () => {
    const temas = [
      { id: 'detox', publicado: true, dias_liberado: 7 },
      { id: 'a', publicado: true, dias_liberado: 30 },
      { id: 'rascunho', publicado: false, dias_liberado: 30 },
      { id: 'b', publicado: true, dias_liberado: 30 },
    ]
    expect(iniciosDosTemas(temas)).toEqual({ detox: 1, a: 8, b: 38 })
  })
})
