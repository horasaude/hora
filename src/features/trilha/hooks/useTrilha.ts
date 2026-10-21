import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Trilha } from '@/domain/trilha'
import { usePrevia } from '../previa'
import { buscarComeceAqui, buscarRegras, marcarComece, type ItemComece } from '../api/comece.api'
import {
  aulaConcluida,
  buscarAula,
  buscarMateriaisAula,
  buscarTrilha,
  buscarTrilhaPrevia,
  marcarConcluida,
} from '../api/trilha.api'

/** Trilha da aluna; dentro da pré-visualização do painel, a do dia escolhido. */
export function useTrilha() {
  const previa = usePrevia()
  const feitas = previa?.concluidas
  return useQuery({
    queryKey: previa ? ['trilha-previa', previa.dia] : ['trilha'],
    queryFn: () => (previa ? buscarTrilhaPrevia(previa.dia) : buscarTrilha()),
    select: feitas?.size
      ? (t: Trilha) => ({
          ...t,
          temas: t.temas.map((x) => ({
            ...x,
            aulas: x.aulas.map((a) => (feitas.has(a.id) ? { ...a, concluida: true } : a)),
          })),
        })
      : undefined,
  })
}

export const useAula = (id: string) =>
  useQuery({ queryKey: ['aula-aluna', id], queryFn: () => buscarAula(id) })

export const useConcluida = (id: string) =>
  useQuery({ queryKey: ['aula-concluida', id], queryFn: () => aulaConcluida(id) })

/** Concluir aula: atualiza aula, trilha (pode abrir etapa), pontos e ranking. */
export function useMarcarConcluida(id: string) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (concluida: boolean) => marcarConcluida(id, concluida),
    onSuccess: () => {
      for (const chave of [
        'aula-concluida',
        'trilha',
        'ranking',
        'ultimo-ponto',
        'meus-pontos',
        'aulas-concluidas-total',
      ]) {
        cliente.invalidateQueries({ queryKey: [chave] })
      }
    },
  })
}

export const useComeceAqui = () =>
  useQuery({ queryKey: ['comece-aqui'], queryFn: buscarComeceAqui })

export function useMarcarComece() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (item: ItemComece) => marcarComece(item),
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['comece-aqui'] }),
  })
}

export const useRegras = () => useQuery({ queryKey: ['regras-pontos'], queryFn: buscarRegras })

/** Links assinados valem 10 minutos: renova antes de vencer. */
export const useMateriaisAula = (id: string, ativo: boolean) =>
  useQuery({
    queryKey: ['materiais-aula', id],
    queryFn: () => buscarMateriaisAula(id),
    enabled: ativo,
    staleTime: 5 * 60_000,
    refetchInterval: 8 * 60_000,
  })
