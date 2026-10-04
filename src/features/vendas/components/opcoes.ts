import type { Plano, Precos } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'
import { textos } from '../textos'

const t = textos.precos

export type OpcaoPreco = { plano: Plano; valor: string; rotulo: string }

/** As três formas de pagar, com o valor vigente, na ordem da página (Pix em destaque). */
export function opcoesDePreco(p: Precos): OpcaoPreco[] {
  const parcelas = `${t.vezes(p.parcelas)} `
  return [
    { plano: 'pix', valor: formatarPreco(p.pixCentavos), rotulo: t.pix },
    {
      plano: 'parcelado',
      valor: parcelas + formatarPreco(p.parceladoCentavos),
      rotulo: t.parcelado,
    },
    {
      plano: 'recorrente',
      valor: parcelas + formatarPreco(p.recorrenteCentavos),
      rotulo: t.recorrente,
    },
  ]
}
