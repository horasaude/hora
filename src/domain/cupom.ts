import type { Plano, Precos } from './precos'

/** Cupom válido, como o banco devolve em consultar_cupom. Valor: % (1 a 90) ou centavos. */
export type Cupom = {
  codigo: string
  tipo: 'porcentagem' | 'valor'
  valor: number
  planos: Plano[]
}

/** Menor cobrança que o Asaas aceita. */
export const MINIMO_CENTAVOS = 500

/**
 * Valor com o cupom: no Pix e no parcelado sobre o total, no mensal sobre cada mensalidade.
 * Nunca fica abaixo do mínimo do Asaas. A mesma conta roda na Edge Function (regras.ts).
 */
export function aplicarCupom(centavos: number, c: Pick<Cupom, 'tipo' | 'valor'>): number {
  const desconto =
    c.tipo === 'porcentagem' ? Math.round((centavos * c.valor) / 100) : Math.round(c.valor)
  return Math.max(MINIMO_CENTAVOS, centavos - desconto)
}

export const cupomVale = (c: Pick<Cupom, 'planos'>, plano: Plano) => c.planos.includes(plano)

/** Preços da tela com o cupom nos planos em que ele vale (parcelado: sobre o total das 12). */
export function precosComCupom(p: Precos, c: Cupom | null): Precos {
  if (!c) return p
  const total = p.parceladoCentavos * p.parcelas
  return {
    ...p,
    pixCentavos: cupomVale(c, 'pix') ? aplicarCupom(p.pixCentavos, c) : p.pixCentavos,
    recorrenteCentavos: cupomVale(c, 'recorrente')
      ? aplicarCupom(p.recorrenteCentavos, c)
      : p.recorrenteCentavos,
    parceladoCentavos: cupomVale(c, 'parcelado')
      ? aplicarCupom(total, c) / p.parcelas
      : p.parceladoCentavos,
  }
}
