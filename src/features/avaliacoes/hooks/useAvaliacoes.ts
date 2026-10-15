import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listarAvaliacoes, salvarRespostas } from '../api/avaliacoes.api'

export const useAvaliacoes = () => useQuery({ queryKey: ['avaliacoes'], queryFn: listarAvaliacoes })

export function useSalvarRespostas() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: salvarRespostas,
    onSuccess: (_, d) => {
      if (d.enviar) cliente.invalidateQueries({ queryKey: ['avaliacoes'] })
    },
  })
}

/** Quantas avaliações ela ainda não enviou (para o aviso em Treinos). */
export function useAvaliacoesPendentes() {
  const q = useAvaliacoes()
  return (q.data ?? []).filter((a) => !a.enviada_em && a.perguntas.length > 0)
}
