import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { sair } from '../api/auth.api'

/** Sai da conta, limpa o que estava em cache e volta para /entrar. */
export function useSair() {
  const cliente = useQueryClient()
  const navegar = useNavigate()
  return useMutation({
    mutationFn: sair,
    onSuccess: () => {
      cliente.clear()
      navegar('/entrar', { replace: true })
    },
  })
}
