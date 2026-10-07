import { useQuery } from '@tanstack/react-query'
import { buscarRanking, buscarUltimoPonto, type Periodo } from '../api/ranking.api'

export const useRanking = (periodo: Periodo) =>
  useQuery({ queryKey: ['ranking', periodo], queryFn: () => buscarRanking(periodo) })

/** Minha linha no ranking do período (undefined enquanto carrega ou sem acesso). */
export function useMinhaPosicao(periodo: Periodo = 'mes') {
  const q = useRanking(periodo)
  return { ...q, eu: q.data?.find((l) => l.eu) }
}

export const useUltimoPonto = () =>
  useQuery({ queryKey: ['ultimo-ponto'], queryFn: buscarUltimoPonto })
