import { precosPara } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'
import { usePrecos } from '../hooks/usePrecos'
import { textos } from '../textos'
import { ContagemOferta } from './ContagemOferta'
import { Garantia } from './Garantia'
import { Plano, type DadosPlano } from './Plano'
import { Secao } from './Secao'

const t = textos.preco

/** Três planos lado a lado. Na oferta, o preço normal aparece riscado; depois troca sozinho. */
export function Preco() {
  const p = usePrecos()
  const cheio = precosPara(false)
  const vezes = t.vezes(p.parcelas)
  const riscar = (texto: string) => (p.emOferta ? texto : null)
  const acesso = t.acesso(p.mesesAcesso)
  const planos: DadosPlano[] = [
    {
      plano: 'parcelado',
      vezes,
      valor: formatarPreco(p.parceladoCentavos),
      riscado: riscar(`${vezes} ${formatarPreco(cheio.parceladoCentavos)}`),
      acesso,
      mesGratis: p.emOferta,
      destaque: true,
      ordem: 'md:order-2',
    },
    {
      plano: 'pix',
      valor: formatarPreco(p.pixCentavos),
      riscado: riscar(formatarPreco(cheio.pixCentavos)),
      acesso,
      mesGratis: p.emOferta,
      ordem: 'md:order-1',
    },
    {
      plano: 'recorrente',
      vezes,
      valor: formatarPreco(p.recorrenteCentavos),
      riscado: riscar(`${vezes} ${formatarPreco(cheio.recorrenteCentavos)}`),
      acesso,
      mesGratis: p.emOferta,
      ordem: 'md:order-3',
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
