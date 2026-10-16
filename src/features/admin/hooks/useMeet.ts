import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { contaGoogle, criarSala, linkConectar } from '../api/meet.api'

export const useContaGoogle = () => useQuery({ queryKey: ['conta-google'], queryFn: contaGoogle })

/** Leva a profissional para a tela de autorização do Google. */
export const useConectarGoogle = () =>
  useMutation({
    mutationFn: linkConectar,
    onSuccess: (url) => {
      if (url) window.location.assign(url)
    },
  })

export function useCriarSala() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: criarSala,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['lives'] }),
  })
}
