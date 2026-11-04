import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cadastrarParceira, encerrarParceria, reenviarEmailParceira } from './parceiras.api'

export function useCadastrarParceira() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: cadastrarParceira,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['alunas'] }),
  })
}

export const useReenviarEmail = () => useMutation({ mutationFn: reenviarEmailParceira })

export function useEncerrarParceria() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: encerrarParceria,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['alunas'] }),
  })
}
