import { OBJETIVO_DO_TEMA } from '@/domain/plano'
import { temaAtual } from '@/domain/trilha'
import { useTrilha } from '@/features/trilha'

/** Objetivo do tema do momento na trilha (null quando o tema não tem objetivo de receita). */
export function useObjetivo(): { objetivo: string | null; carregando: boolean } {
  const trilha = useTrilha()
  const chave = trilha.data ? (temaAtual(trilha.data)?.chave ?? null) : null
  return {
    objetivo: chave ? (OBJETIVO_DO_TEMA[chave] ?? null) : null,
    carregando: trilha.isPending,
  }
}
