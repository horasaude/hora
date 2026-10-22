import { useQuery } from '@tanstack/react-query'
import { buscarPendencia } from '../api/pendencia.api'

/** Mensalidade em aberto da aluna (chave ['minha-pendencia']). */
export const usePendencia = () =>
  useQuery({ queryKey: ['minha-pendencia'], queryFn: buscarPendencia, staleTime: 60_000 }).data
