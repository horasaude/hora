import { Carregando, Cartao, ErroCarregar, Vazio } from '@/components/ui'
import { useCardapios } from '../hooks/useCardapios'
import { useObjetivo } from '../hooks/useObjetivo'
import { textos } from '../textos'
import { CartaoCardapio } from './CartaoCardapio'

/** Cardápios publicados do tema dela (antes da escolha do tema, todos). */
export function ListaCardapios() {
  const cardapios = useCardapios()
  const { objetivo, carregando } = useObjetivo()
  if (cardapios.isPending || carregando) return <Carregando texto={textos.carregando} />
  if (cardapios.isError)
    return (
      <ErroCarregar
        texto={textos.erro}
        tentar={textos.tentar}
        aoTentar={() => cardapios.refetch()}
      />
    )
  const lista = objetivo ? cardapios.data.filter((c) => c.objetivo === objetivo) : cardapios.data
  return (
    <div className="flex flex-col gap-4">
      {!objetivo && <Cartao className="text-sm text-suave">{textos.semTema}</Cartao>}
      {lista.length === 0 ? (
        <Vazio>{textos.vazio}</Vazio>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lista.map((c) => (
            <li key={c.id}>
              <CartaoCardapio c={c} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
