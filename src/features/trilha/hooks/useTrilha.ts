import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePrevia } from '../previa'
import { buscarComeceAqui, buscarRegras, marcarComece, type ItemComece } from '../api/comece.api'
import {
  aulaConcluida,
  buscarAula,
  buscarMateriaisAula,
  buscarTrilha,
  buscarTrilhaPrevia,
  escolherTema,
  marcarConcluida,
} from '../api/trilha.api'

/** Trilha da aluna; dentro da pré-visualização do painel, a do dia e tema escolhidos. */
export function useTrilha() {
  const previa = usePrevia()
  return useQuery({
    queryKey: previa ? ['trilha-previa', previa.dia, previa.tema] : ['trilha'],
    queryFn: () => (previa ? buscarTrilhaPrevia(previa.dia, previa.tema) : buscarTrilha()),
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

export function useEscolherTema() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: escolherTema,
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ['trilha'] })
      cliente.invalidateQueries({ queryKey: ['cardapios-aluna'] })
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
