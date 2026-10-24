import { useConfiguracao } from '@/features/configuracao'
import { formatarPreco } from '@/lib/moeda'
import { usePrecos } from '../hooks/usePrecos'
import { textos } from '../textos'
import { ContagemOferta } from './ContagemOferta'
import { Garantia } from './Garantia'
import { Plano, type DadosPlano } from './Plano'
import { Secao } from './Secao'

const t = textos.preco

/** Três planos lado a lado (no celular: menor parcela, mensal e o Pix por último), com o preço de antes riscado; no dia 24/10, o 13º mês grátis. */
export function Preco() {
  const p = usePrecos()
  const cheio = useConfiguracao().cheio
  const vezes = t.vezes(p.parcelas)
  const riscar = (texto: string) => texto
  const acesso = t.acesso(p.mesesAcesso)
  const planos: DadosPlano[] = [
    {
      plano: 'parcelado',
      vezes,
      valor: formatarPreco(p.parceladoCentavos),
      riscado: riscar(`${vezes} ${formatarPreco(cheio.parcelado)}`),
      acesso,
      mesGratis: p.emOferta,
      destaque: true,
      ordem: 'md:order-2',
    },
    {
      plano: 'recorrente',
      vezes,
      valor: formatarPreco(p.recorrenteCentavos),
      riscado: riscar(`${vezes} ${formatarPreco(cheio.recorrente)}`),
      acesso,
      mesGratis: p.emOferta,
      ordem: 'md:order-3',
    },
    {
      plano: 'pix',
      valor: formatarPreco(p.pixCentavos),
      riscado: riscar(formatarPreco(cheio.pix)),
      acesso,
      mesGratis: p.emOferta,
      ordem: 'md:order-1',
    },
  ]
  return (
    <Secao id="preco" etiqueta={t.etiqueta} titulo={t.titulo} semBotao>
      <ContagemOferta />
      <ul className="mt-8 grid gap-6 md:grid-cols-3 md:items-center md:gap-4">
        {planos.map((dados, i) => (
          <Plano key={dados.plano} {...dados} atraso={i * 120} />
        ))}
      </ul>
      <p className="mt-6 text-center text-sm font-medium text-ora">{t.seguro}</p>
      <Garantia />
    </Secao>
  )
}
