// Pré-visualização do painel: a trilha mostra um dia e um tema escolhidos, sem gravar nada.
import { createContext, useContext } from 'react'

export type Previa = {
  dia: number
  tema: string | null
  escolherTema: (id: string) => void
  sufixo: string
}

export const ContextoPrevia = createContext<Previa | null>(null)

/** Pré-visualização aberta (null fora dela). */
export const usePrevia = () => useContext(ContextoPrevia)

/** Endereço da aula: na pré-visualização fica dentro dela, com o mesmo dia e tema. */
export function useLinkAula() {
  const p = usePrevia()
  return (id: string) => (p ? `/app/previa/aula/${id}${p.sufixo}` : `/app/trilha/aula/${id}`)
}
