import type { ReactNode } from 'react'
import { BotaoBrilho, Cartao } from '@/components/ui'
import { textosAlunaEstado as e } from '../textosEstado'

/** Carregando, erro, vazio ou a lista. */
export function Conteudo<T>({
  consulta,
  itens,
  vazio,
  children,
}: {
  consulta: { isPending: boolean; isError: boolean; refetch: () => unknown }
  itens: T[] | undefined
  vazio: string
  children: (itens: T[]) => ReactNode
}) {
  if (consulta.isPending) return <p className="text-sm text-suave">{e.carregando}</p>
  if (consulta.isError)
    return (
      <Cartao className="flex flex-col items-start gap-3 text-sm">
        <p role="alert">{e.erro}</p>
        <BotaoBrilho tom="cinza" onClick={() => consulta.refetch()}>
          {e.tentar}
        </BotaoBrilho>
      </Cartao>
    )
  if (!itens || itens.length === 0)
    return <Cartao className="py-12 text-center text-sm text-suave">{vazio}</Cartao>
  return <div className="flex flex-col gap-4">{children(itens)}</div>
}
