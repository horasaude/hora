import { useQuery } from '@tanstack/react-query'
import { buscarPapel } from '../api/auth.api'

/** Papel da usuária logada ("aluna" ou "admin"). Só decide o que mostrar; quem protege é o banco. */
export function usePapel() {
  return useQuery({ queryKey: ['papel'], queryFn: buscarPapel, staleTime: 5 * 60_000 })
}
