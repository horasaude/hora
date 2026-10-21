import { Carregando, ErroCarregar, Vazio } from '@/components/ui'
import { useTrilha } from '@/features/trilha'
import type { Cardapio } from '../api/cardapios.api'
import { useCardapios } from '../hooks/useCardapios'
import { planosPorTema } from '../planosPorTema'
import { textos } from '../textos'
import { CartaoCardapio } from './CartaoCardapio'

function Planos({ lista, titulo }: { lista: Cardapio[]; titulo?: string }) {
  return (
    <section className="flex flex-col gap-3">
      {titulo && <h2 className="text-[18px] font-bold text-verde-escuro">{titulo}</h2>}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {lista.map((c) => (
          <li key={c.id}>
            <CartaoCardapio c={c} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Todos os planos dos temas abertos, separados por tema. */
function PorTema({ lista }: { lista: Cardapio[] }) {
  const trilha = useTrilha()
  if (trilha.isPending) return <Carregando texto={textos.carregando} />
  const grupos = planosPorTema(lista, trilha.data?.temas ?? [])
  return (
    <div className="flex flex-col gap-6">
      {grupos.map((g) => (
        <Planos
          key={g.temaId ?? 'outros'}
          lista={g.planos}
          titulo={g.titulo ?? (grupos.length > 1 ? textos.outrosPlanos : undefined)}
        />
      ))}
    </div>
  )
}

/** Planos alimentares publicados; com temaId, os planos daquele tema para ela escolher (o banco já entrega só os de temas abertos). */
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
  if (!temaId) return <PorTema lista={lista} />
  return <Planos lista={lista} titulo={lista.length > 1 ? textos.escolhaPlano : undefined} />
}
