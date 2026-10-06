import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aulaConcluida, buscarAula, buscarTrilha, marcarConcluida } from '../api/trilha.api'

export const useTrilha = () => useQuery({ queryKey: ['trilha'], queryFn: buscarTrilha })

export const useAula = (id: string) =>
  useQuery({ queryKey: ['aula-aluna', id], queryFn: () => buscarAula(id) })

export const useConcluida = (id: string) =>
  useQuery({ queryKey: ['aula-concluida', id], queryFn: () => aulaConcluida(id) })

/** Marcar como concluída; atualiza a aula e a trilha. */
export function useMarcarConcluida(id: string) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (concluida: boolean) => marcarConcluida(id, concluida),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ['aula-concluida', id] })
      cliente.invalidateQueries({ queryKey: ['trilha'] })
    },
  })
}
