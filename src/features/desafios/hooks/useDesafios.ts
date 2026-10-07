import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  buscarDesafios,
  buscarMeusDias,
  buscarRankingDesafio,
  entrarDesafio,
  fazerCheckinDesafio,
  type CheckinDesafio,
} from '../api/desafios.api'

export const useDesafios = () => useQuery({ queryKey: ['desafios-aluna'], queryFn: buscarDesafios })

export const useMeusDias = (id: string) =>
  useQuery({ queryKey: ['desafio-dias', id], queryFn: () => buscarMeusDias(id) })

export const useRankingDesafio = (id: string) =>
  useQuery({ queryKey: ['desafio-ranking', id], queryFn: () => buscarRankingDesafio(id) })

function useAtualizar() {
  const cliente = useQueryClient()
  return (id: string) => {
    for (const chave of [
      ['desafios-aluna'],
      ['desafio-dias', id],
      ['desafio-ranking', id],
      ['ranking'],
      ['ultimo-ponto'],
      ['meus-pontos'],
    ]) {
      cliente.invalidateQueries({ queryKey: chave })
    }
  }
}

export function useEntrarDesafio() {
  const atualizar = useAtualizar()
  return useMutation({ mutationFn: entrarDesafio, onSuccess: (_, id) => atualizar(id) })
}

export function useCheckinDesafio() {
  const atualizar = useAtualizar()
  return useMutation({
    mutationFn: (d: CheckinDesafio) => fazerCheckinDesafio(d),
    onSuccess: (_, d) => atualizar(d.desafio),
  })
}
