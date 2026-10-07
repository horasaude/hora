import { useQuery } from '@tanstack/react-query'
import { ordemVitrine } from '@/domain/loja'
import { listarVitrine } from '../api/loja.api'

export const useVitrine = () =>
  useQuery({
    queryKey: ['vitrine'],
    queryFn: async () => ordemVitrine(await listarVitrine()),
    staleTime: 20 * 60_000,
  })
