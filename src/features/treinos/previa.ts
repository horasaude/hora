// Pré-visualização do painel (Ver como aluna > Treinos): mostra o que a aluna do tema veria, sem gravar nada.
import { createContext, useContext } from 'react'
import type { Filtro } from './api/treinos.api'

export const ContextoPreviaTreinos = createContext<Filtro | null>(null)

/** Filtro da pré-visualização; null para a aluna (aí quem filtra é o banco). */
export const usePreviaTreinos = () => useContext(ContextoPreviaTreinos)
