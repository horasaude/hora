import { OBJETIVO_DO_TEMA } from '@/domain/plano'
import { useTrilha } from '@/features/trilha'

/** Objetivo do tema escolhido na trilha (null antes da escolha). */
export function useObjetivo(): { objetivo: string | null; carregando: boolean } {
  const trilha = useTrilha()
  const t = trilha.data
  const chave = t?.temas.find((x) => x.id === t.tema_atual)?.chave ?? null
  return {
    objetivo: chave ? (OBJETIVO_DO_TEMA[chave] ?? null) : null,
    carregando: trilha.isPending,
  }
}
