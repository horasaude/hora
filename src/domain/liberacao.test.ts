import { describe, expect, it } from 'vitest'
import { liberacaoPara, modoDe } from './liberacao'

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
