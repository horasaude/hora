import { useQuery } from '@tanstack/react-query'
import { buscarNome } from '../api/auth.api'

/** Nome da usuária logada. */
export function useNome() {
  return useQuery({ queryKey: ['nome'], queryFn: buscarNome, staleTime: 5 * 60_000 })
}
