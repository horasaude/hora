import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listarEquipe } from '../api/equipe.api'

export const useEquipe = () => useQuery({ queryKey: ['equipe'], queryFn: listarEquipe })

/** Mutação da equipe: atualiza a lista e o perfil do fórum. */
export function useAcaoEquipe<E, S>(fn: (d: E) => Promise<S>) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ['equipe'] })
      cliente.invalidateQueries({ queryKey: ['perfil-equipe'] })
    },
  })
}
