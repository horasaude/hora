import { Carregando, ErroCarregar } from '@/components/ui'
import { useMateriais } from '../hooks/useMateriais'
import { textos } from '../textos'

/** Materiais da nutricionista do tema em cartões que abrem e fecham com um toque; sem nenhum, não mostra nada. */
export function ListaMateriais({ temaId }: { temaId: string }) {
  const materiais = useMateriais()
  if (materiais.isPending) return <Carregando texto={textos.carregando} />
  if (materiais.isError)
    return (
      <ErroCarregar
        texto={textos.erro}
        tentar={textos.tentar}
        aoTentar={() => materiais.refetch()}
      />
    )
  const lista = materiais.data.filter((m) => m.tema_id === temaId)
  if (lista.length === 0) return null
  return (
    <ul className="grid items-start gap-3 lg:grid-cols-2">
      {lista.map((m) => (
        <li key={m.id}>
          <details className="group rounded-[18px] border border-linha bg-white shadow-cartao">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-bold text-tinta">
              {m.titulo}
              <span
                aria-hidden
                className="size-2.5 shrink-0 rotate-45 border-r-2 border-b-2 border-suave transition group-open:rotate-[225deg]"
              />
            </summary>
            <p className="border-t border-linha px-4 py-4 text-[15px] leading-relaxed whitespace-pre-line text-tinta">
              {m.texto}
            </p>
          </details>
        </li>
      ))}
    </ul>
  )
}
