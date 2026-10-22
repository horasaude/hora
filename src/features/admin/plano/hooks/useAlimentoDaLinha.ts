import { useQuery } from '@tanstack/react-query'
import { buscarAlimento } from '../api/alimentos.api'

/** Alimento da linha com as medidas caseiras, para trocar a medida ao editar (receita não tem medida). */
export const useAlimentoDaLinha = (id: string | null) =>
  useQuery({
    queryKey: ['alimento-da-linha', id],
    queryFn: () => buscarAlimento(id ?? ''),
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
  })
