import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  cliquesPorSemana,
  linksFotos,
  listarParceiros,
  listarProdutos,
  resumoLoja,
} from '../api/loja.api'

export const useResumoLoja = () => useQuery({ queryKey: ['loja', 'resumo'], queryFn: resumoLoja })
export const useProdutos = () =>
  useQuery({ queryKey: ['loja', 'produtos'], queryFn: listarProdutos })
export const useParceiros = () =>
  useQuery({ queryKey: ['loja', 'parceiros'], queryFn: listarParceiros })
export const useCliquesSemana = (produto: string) =>
  useQuery({ queryKey: ['loja', 'cliques', produto], queryFn: () => cliquesPorSemana(produto) })
export const useLinksFotos = (caminhos: string[]) =>
  useQuery({
    queryKey: ['loja', 'fotos', caminhos],
    queryFn: () => linksFotos(caminhos),
    staleTime: 30 * 60_000,
  })

/** Mutação da loja: atualiza resumo, listas e fotos. */
export function useAcaoLoja<E, S>(fn: (d: E) => Promise<S>) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['loja'] }),
  })
}
