import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { entrarComSenha } from '../api/auth.api'

export function useLogin() {
  const navegar = useNavigate()
  return useMutation({
    mutationFn: entrarComSenha,
    onSuccess: () => navegar('/', { replace: true }),
  })
}
