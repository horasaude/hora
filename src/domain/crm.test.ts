import { describe, expect, it } from 'vitest'
import { resumoMembros, resumoVendas } from './crm'

const agora = new Date('2026-10-23T15:00:00Z')
const diasAtras = (n: number) => new Date(agora.getTime() - n * 86_400_000).toISOString()
const membro = (ultimo: number | null, extra = {}) => ({
  acesso_inicio_em: diasAtras(20),
  acesso_fim_em: null,
  ultimo_acesso_em: ultimo === null ? null : diasAtras(ultimo),
  cobranca: null,
  ...extra,
})

describe('resumoMembros', () => {
  it('separa quem está fazendo, em atenção, parada e sem acesso', () => {
    const r = resumoMembros(
      [
        membro(0),
        membro(1),
        membro(4),
        membro(10),
        membro(null),
        membro(0, { acesso_fim_em: diasAtras(1) }),
        membro(0, { cobranca: 'inadimplente' }),
        membro(0, { cobranca: 'suspensa' }),
      ],
      agora,
    )
    expect(r).toEqual({
      inscritas: 8,
      ativas: 7,
      fazendo: 4,
      atencao: 1,
      paradas: 2,
      semAcesso: 1,
      emAtraso: 1,
      pausadas: 1,
    })
  })
})

describe('resumoVendas', () => {
  it('conta o mês em Brasília, o total, a forma de pagamento e as devolvidas', () => {
    const v = (status: string, plano: string, valor: number, quando: string | null) => ({
      status,
      plano,
      valor_centavos: valor,
      aprovado_em: quando,
    })
    const r = resumoVendas(
      [
        v('aprovado', 'pix', 189700, '2026-10-01T03:30:00Z'),
        v('aprovado', 'recorrente', 21770, '2026-10-22T12:00:00Z'),
        v('aprovado', 'parcelado', 225240, '2026-10-01T02:30:00Z'),
        v('reembolsado', 'pix', 189700, '2026-10-05T12:00:00Z'),
        v('pendente', 'pix', 189700, null),
      ],
      agora,
    )
    expect(r).toEqual({
      vendasMes: 2,
      valorMes: 211470,
      vendas: 3,
      valor: 436710,
      porPlano: { pix: 1, parcelado: 1, recorrente: 1 },
      devolvidas: 1,
    })
  })
})
