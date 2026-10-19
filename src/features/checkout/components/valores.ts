import type { Plano, Precos } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'

/** Total do parcelado: o mesmo em qualquer número de parcelas. */
export const totalParcelado = (p: Precos) => p.parceladoCentavos * p.parcelas

/** Como o valor de cada plano aparece no checkout (no parcelado, nas parcelas escolhidas). */
export function valorDoPlano(p: Precos, plano: Plano, parcelas = p.parcelas): string {
  if (plano === 'pix') return formatarPreco(p.pixCentavos)
  if (plano === 'recorrente') return `${p.parcelas}x de ${formatarPreco(p.recorrenteCentavos)}`
  const n = Number.isInteger(parcelas) && parcelas >= 1 && parcelas <= 12 ? parcelas : p.parcelas
  return `${n}x de ${formatarPreco(Math.round(totalParcelado(p) / n))}`
}
