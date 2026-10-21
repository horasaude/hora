import { Carregando, ErroCarregar, Vazio } from '@/components/ui'
import { useCardapios } from '../hooks/useCardapios'
import { textos } from '../textos'
import { CartaoCardapio } from './CartaoCardapio'

/** Cardápios publicados; com temaId, só os daquele tema (o banco já entrega só os de temas abertos). */
export function ListaCardapios({ temaId }: { temaId?: string }) {
  const cardapios = useCardapios()
  if (cardapios.isPending) return <Carregando texto={textos.carregando} />
  if (cardapios.isError)
    return (
      <ErroCarregar
        texto={textos.erro}
        tentar={textos.tentar}
        aoTentar={() => cardapios.refetch()}
      />
    )
  const lista = temaId ? cardapios.data.filter((c) => c.tema_id === temaId) : cardapios.data
  if (lista.length === 0) return <Vazio>{textos.vazio}</Vazio>
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {lista.map((c) => (
        <li key={c.id}>
          <CartaoCardapio c={c} />
        </li>
      ))}
    </ul>
  )
}
