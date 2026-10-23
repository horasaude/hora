import type { ReactNode } from 'react'
import { Carregando, ErroCarregar } from '@/components/ui'
import { useMateriais } from '../hooks/useMateriais'
import { textos } from '../textos'

/** Materiais do tema (da nutricionista ou, na aba Saúde, da Dra. Clara) em cartões que abrem e fecham
 * com um toque; sem nenhum, não mostra nada. */
export function ListaMateriais({
  temaId,
  area = 'nutricao',
  anexos,
}: {
  temaId: string
  area?: 'nutricao' | 'saude'
  /** Arquivos e links do material (PDF, Word, foto, vídeo), mostrados quando ele abre. */
  anexos?: (id: string) => ReactNode
}) {
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
  const lista = materiais.data.filter((m) => m.tema_id === temaId && m.area === area)
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
            <div className="flex flex-col gap-4 border-t border-linha px-4 py-4">
              {m.texto && (
                <p className="text-[15px] leading-relaxed whitespace-pre-line text-tinta">
                  {m.texto}
                </p>
              )}
              {anexos?.(m.id)}
            </div>
          </details>
        </li>
      ))}
    </ul>
  )
}
