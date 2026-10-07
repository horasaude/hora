import type { Plano, Precos } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'

/** Como o valor de cada plano aparece no checkout. */
export function valorDoPlano(p: Precos, plano: Plano): string {
  if (plano === 'pix') return formatarPreco(p.pixCentavos)
  const parcela = plano === 'parcelado' ? p.parceladoCentavos : p.recorrenteCentavos
  return `${p.parcelas}x de ${formatarPreco(parcela)}`
}

/** Valor que o Brick cobra: Pix à vista, total das 12 parcelas, ou o mês da assinatura. */
export function centavosDoBrick(p: Precos, plano: Plano): number {
  if (plano === 'pix') return p.pixCentavos
  return plano === 'parcelado' ? p.parceladoCentavos * p.parcelas : p.recorrenteCentavos
}
