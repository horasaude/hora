import { useQuery } from '@tanstack/react-query'
import { buscarMateriais } from '../api/materiais.api'

/** Materiais publicados pela nutricionista. */
export const useMateriais = () =>
  useQuery({ queryKey: ['materiais-aluna'], queryFn: buscarMateriais })
