import { describe, expect, it } from 'vitest'
import { deLinha } from './configuracao.api'

describe('deLinha', () => {
  it('monta preços, janela e documentos da linha do banco', () => {
    const c = deLinha({
      pix_cheio: 229700,
      parcelado_cheio: 22700,
      recorrente_cheio: 24700,
      pix_oferta: 199700,
      parcelado_oferta: 19800,
      recorrente_oferta: 21500,
      oferta_inicio: '2026-10-24T03:00:00+00:00',
      oferta_fim: '2026-10-25T02:59:59+00:00',
      termos: [{ titulo: 'Quem somos', texto: 'A ORA' }],
      privacidade: [],
      termos_atualizado_em: '2026-10-05T12:00:00+00:00',
      privacidade_atualizado_em: '2026-10-05T12:00:00+00:00',
    })
    expect(c?.config.oferta.pix).toBe(199700)
    expect(c?.config.ofertaFim.toISOString()).toBe('2026-10-25T02:59:59.000Z')
    expect(c?.termos.secoes[0]?.titulo).toBe('Quem somos')
  })
  it('linha fora do formato vira null (a página fica com o padrão)', () => {
    expect(deLinha({ pix_cheio: 'caro' })).toBeNull()
    expect(deLinha(undefined)).toBeNull()
  })
})
