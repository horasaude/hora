import { Carregando, ErroCarregar, Vazio } from '@/components/ui'
import { useDesafios } from '../hooks/useDesafios'
import { textos } from '../textos'
import { CartaoDesafio } from './CartaoDesafio'
import { CartaoEncerrado } from './CartaoEncerrado'

/** Desafio(s) do tema, dentro da página do tema: valem nos dias do tema para cada aluna. */
export function DesafiosDoTema({ temaId }: { temaId: string }) {
  const desafios = useDesafios()
  if (desafios.isPending) return <Carregando texto={textos.carregando} />
  if (desafios.isError)
    return (
      <ErroCarregar
        texto={textos.erro}
        tentar={textos.tentar}
        aoTentar={() => desafios.refetch()}
      />
    )
  const lista = desafios.data.filter((d) => d.tema_id === temaId)
  if (lista.length === 0) return <Vazio>{textos.vazioTema}</Vazio>
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {lista.map((d) => (
        <li key={d.id}>{d.encerrado ? <CartaoEncerrado d={d} /> : <CartaoDesafio d={d} />}</li>
      ))}
    </ul>
  )
}
