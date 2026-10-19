import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { buscarMeuPedido, pedirCancelamento } from '../api/cancelamento.api'

const CHAVE = ['meu-pedido']

export const useMeuPedido = () => useQuery({ queryKey: CHAVE, queryFn: buscarMeuPedido })

export function usePedirCancelamento() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: pedirCancelamento,
    onSuccess: () => cliente.invalidateQueries({ queryKey: CHAVE }),
  })
}
