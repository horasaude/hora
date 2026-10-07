import { describe, expect, it } from 'vitest'
import { CONFIGURACAO_PADRAO as P } from '../../../../src/domain/configuracao'
import { precosPara } from '../../../../src/domain/precos'
import {
  cpfValido,
  dataMp,
  fimDoAcesso,
  precoPedido,
  reais,
  type ConfiguracaoPrecos,
} from './regras.ts'

const config: ConfiguracaoPrecos = {
  pix_cheio: P.cheio.pix,
  parcelado_cheio: P.cheio.parcelado,
  recorrente_cheio: P.cheio.recorrente,
  pix_oferta: P.oferta.pix,
  parcelado_oferta: P.oferta.parcelado,
  recorrente_oferta: P.oferta.recorrente,
  oferta_inicio: P.ofertaInicio.toISOString(),
  oferta_fim: P.ofertaFim.toISOString(),
}

/** Horário de Brasília (UTC-3) para Date. */
const brasilia = (texto: string) => new Date(`${texto}-03:00`)

describe('preço decidido no servidor', () => {
  it('no dia 24/10 vale a oferta, com 13 meses', () => {
    const p = precoPedido('pix', brasilia('2026-10-24T15:00:00'), config)
    expect(p).toEqual({ valorCentavos: P.oferta.pix, parcelas: 1, oferta: true, mesesAcesso: 13 })
  })

  it('fora do dia 24/10 vale o preço cheio, com 12 meses', () => {
    const p = precoPedido('pix', brasilia('2026-10-20T15:00:00'), config)
    expect(p).toEqual({ valorCentavos: P.cheio.pix, parcelas: 1, oferta: false, mesesAcesso: 12 })
  })

  it('vira à meia-noite de Brasília, nos dois lados do dia', () => {
    expect(precoPedido('pix', brasilia('2026-10-23T23:59:59'), config).oferta).toBe(false)
    expect(precoPedido('pix', brasilia('2026-10-24T00:00:00'), config).oferta).toBe(true)
    expect(precoPedido('pix', brasilia('2026-10-24T23:59:59'), config).oferta).toBe(true)
    expect(precoPedido('pix', brasilia('2026-10-25T00:00:00'), config).oferta).toBe(false)
  })

  it('parcelado cobra o total das 12 parcelas; recorrente cobra o mês', () => {
    const agora = brasilia('2026-10-24T10:00:00')
    expect(precoPedido('parcelado', agora, config).valorCentavos).toBe(P.oferta.parcelado * 12)
    expect(precoPedido('recorrente', agora, config)).toMatchObject({
      valorCentavos: P.oferta.recorrente,
      parcelas: 12,
    })
  })

  it('bate com os preços que a página mostra (src/domain/precos.ts)', () => {
    for (const quando of ['2026-10-24T12:00:00', '2026-11-02T12:00:00']) {
      const servidor = precoPedido('pix', brasilia(quando), config)
      const tela = precosPara(servidor.oferta, P)
      expect(servidor.valorCentavos).toBe(tela.pixCentavos)
      expect(servidor.mesesAcesso).toBe(tela.mesesAcesso)
      expect(precoPedido('parcelado', brasilia(quando), config).valorCentavos).toBe(
        tela.parceladoCentavos * tela.parcelas,
      )
      expect(precoPedido('recorrente', brasilia(quando), config).valorCentavos).toBe(
        tela.recorrenteCentavos,
      )
    }
  })
})

describe('acesso', () => {
  it('termina 12 meses depois da aprovação, ou 13 com a oferta', () => {
    const aprovado = new Date('2026-10-24T18:00:00Z')
    expect(fimDoAcesso(aprovado, 12).toISOString()).toBe('2027-10-24T18:00:00.000Z')
    expect(fimDoAcesso(aprovado, 13).toISOString()).toBe('2027-11-24T18:00:00.000Z')
  })
})

describe('formatos da API', () => {
  it('reais e data no horário de Brasília', () => {
    expect(reais(229700)).toBe(2297)
    expect(reais(22700)).toBe(227)
    expect(dataMp(new Date('2026-10-24T15:30:00Z'))).toBe('2026-10-24T12:30:00.000-03:00')
  })

  it('CPF pelos dígitos', () => {
    expect(cpfValido('529.982.247-25')).toBe(true)
    expect(cpfValido('529.982.247-24')).toBe(false)
    expect(cpfValido('111.111.111-11')).toBe(false)
  })
})
