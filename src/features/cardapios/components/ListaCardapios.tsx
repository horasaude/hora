import { Carregando, ErroCarregar, Vazio } from '@/components/ui'
import { useCardapios } from '../hooks/useCardapios'
import { textos } from '../textos'
import { CartaoCardapio } from './CartaoCardapio'

/** Cardápios publicados do tema dela; sem tema, os de Preparação (o banco já entrega só esses). */
export function ListaCardapios() {
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
  if (cardapios.data.length === 0) return <Vazio>{textos.vazio}</Vazio>
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cardapios.data.map((c) => (
        <li key={c.id}>
          <CartaoCardapio c={c} />
        </li>
      ))}
    </ul>
  )
}
