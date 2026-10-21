// Pré-visualização do painel: a trilha como a aluna vê num dia escolhido, sem gravar nada.
import { createContext, useContext } from 'react'

/** concluidas e concluir: na prévia a aula assistida ganha o check só na tela (nada é gravado). */
export type Previa = {
  dia: number
  sufixo: string
  concluidas: ReadonlySet<string>
  concluir: (aula: string) => void
}

export const ContextoPrevia = createContext<Previa | null>(null)

/** Pré-visualização aberta (null fora dela). */
export const usePrevia = () => useContext(ContextoPrevia)

/** Endereço da aula: na pré-visualização fica dentro dela, com o mesmo dia. */
export function useLinkAula() {
  const p = usePrevia()
  return (id: string) => (p ? `/app/previa/aula/${id}${p.sufixo}` : `/app/trilha/aula/${id}`)
}

/** Endereço do tema: na pré-visualização fica dentro dela, com o mesmo dia. */
export function useLinkTema() {
  const p = usePrevia()
  return (id: string) => (p ? `/app/previa/tema/${id}${p.sufixo}` : `/app/trilha/tema/${id}`)
}
