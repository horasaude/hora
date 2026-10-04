import type { Plano, Precos } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'
import { textos } from '../../textos'

const t = textos.compra.opcoes

export type OpcaoPagamento = { plano: Plano; valor: string; rotulo: string }

/** As três formas de pagar com o valor vigente. Parcelado primeiro, como na página. */
export function opcoesPagamento(p: Precos): OpcaoPagamento[] {
  const vezes = `${p.parcelas}x `
  return [
    { plano: 'parcelado', valor: vezes + formatarPreco(p.parceladoCentavos), rotulo: t.parcelado },
    { plano: 'pix', valor: formatarPreco(p.pixCentavos), rotulo: t.pix },
    {
      plano: 'recorrente',
      valor: vezes + formatarPreco(p.recorrenteCentavos),
      rotulo: t.recorrente,
    },
  ]
}
