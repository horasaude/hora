import type { Plano, Precos } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'

/** Como o valor de cada plano aparece no checkout. */
export function valorDoPlano(p: Precos, plano: Plano): string {
  if (plano === 'pix') return formatarPreco(p.pixCentavos)
  const parcela = plano === 'parcelado' ? p.parceladoCentavos : p.recorrenteCentavos
  return `${p.parcelas}x de ${formatarPreco(parcela)}`
}
