import { useQuery } from '@tanstack/react-query'
import { podio } from '@/domain/engajamento'
import {
  buscarRanking,
  buscarUltimoPonto,
  linksDosRetratos,
  type Periodo,
} from '../api/ranking.api'

export const useRanking = (periodo: Periodo) =>
  useQuery({ queryKey: ['ranking', periodo], queryFn: () => buscarRanking(periodo) })

/** Minha linha no ranking do período (undefined enquanto carrega ou sem acesso). */
export function useMinhaPosicao(periodo: Periodo = 'mes') {
  const q = useRanking(periodo)
  return { ...q, eu: q.data?.find((l) => l.eu) }
}

export const useUltimoPonto = () =>
  useQuery({ queryKey: ['ultimo-ponto'], queryFn: buscarUltimoPonto })

/** Lugar dela no pódio do mês (1, 2 ou 3), para a coroinha na foto; null fora do pódio. */
export function useLugarNoPodio(): 1 | 2 | 3 | null {
  const eu = podio(useRanking('mes').data ?? []).find((l) => l.eu)
  return eu ? (eu.posicao as 1 | 2 | 3) : null
}

/** Fotos de perfil por caminho (mapa caminho -> link). */
export function useRetratos(caminhos: (string | null | undefined)[]) {
  const chave = caminhos.filter(Boolean).sort().join('|')
  return useQuery({
    queryKey: ['retratos', chave],
    queryFn: () => linksDosRetratos(caminhos),
    enabled: chave !== '',
    staleTime: 50 * 60_000,
  })
}
