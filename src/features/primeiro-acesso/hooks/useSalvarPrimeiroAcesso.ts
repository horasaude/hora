import { useMutation, useQueryClient } from '@tanstack/react-query'
import { salvarPrimeiroAcesso } from '../api/primeiroAcesso.api'

/** Salva o primeiro acesso e recarrega o perfil (a área da aluna abre em seguida). */
export function useSalvarPrimeiroAcesso() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: salvarPrimeiroAcesso,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['meu-perfil'] }),
  })
}
