import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listarCupons, salvarCupom } from '../api/cupons.api'

export const useCupons = () => useQuery({ queryKey: ['cupons'], queryFn: listarCupons })

/** Cria, edita ou liga e desliga um cupom; a lista atualiza. */
export function useSalvarCupom() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: salvarCupom,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['cupons'] }),
  })
}
