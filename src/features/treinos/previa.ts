// Pré-visualização do painel (Ver como aluna > Treinos): mostra o que a aluna do tema veria, sem gravar nada.
import { createContext, useContext } from 'react'
import type { Filtro } from './api/treinos.api'

export const ContextoPreviaTreinos = createContext<Filtro | null>(null)

/** Filtro da pré-visualização; null para a aluna (aí quem filtra é o banco). */
export const usePreviaTreinos = () => useContext(ContextoPreviaTreinos)

/** Tema aberto na página do tema: os treinos mostrados são só os dele. */
export const ContextoTemaTreinos = createContext<string | null>(null)

/** Filtro das consultas: o da pré-visualização ou o do tema aberto; null mostra tudo o que o banco libera. */
export function useFiltroTreinos(): Filtro | null {
  const previa = useContext(ContextoPreviaTreinos)
  const tema = useContext(ContextoTemaTreinos)
  return previa ?? (tema ? { tema } : null)
}
