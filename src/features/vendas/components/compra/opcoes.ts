import type { Plano, Precos } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'
import { textos } from '../../textos'

const t = textos.compra.opcoes

export type OpcaoPagamento = { plano: Plano; valor: string; rotulo: string }

/** As três formas de pagar com o valor vigente. Parcelado, mensal e o Pix por último, como na página no celular. */
export function opcoesPagamento(p: Precos): OpcaoPagamento[] {
  const vezes = `${p.parcelas}x `
  return [
    { plano: 'parcelado', valor: vezes + formatarPreco(p.parceladoCentavos), rotulo: t.parcelado },
    {
      plano: 'recorrente',
      valor: vezes + formatarPreco(p.recorrenteCentavos),
      rotulo: t.recorrente,
    },
    { plano: 'pix', valor: formatarPreco(p.pixCentavos), rotulo: t.pix },
  ]
}
