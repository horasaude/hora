import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { contarAlimentos, listarAlimentos, type Origem } from '../api/alimentos.api'
import { buscarCardapio, listarCardapios, listarRefeicoes } from '../api/cardapios.api'
import { buscarReceita, listarReceitas, listarTags } from '../api/receitas.api'

export const useAlimentos = (origem: Origem, busca: string, pagina: number, tamanho: number) =>
  useQuery({
    queryKey: ['alimentos', origem, busca, pagina, tamanho],
    queryFn: () => listarAlimentos({ origem, busca, pagina, tamanho }),
    placeholderData: keepPreviousData,
  })
export const useContagemAlimentos = () =>
  useQuery({ queryKey: ['alimentos-contagem'], queryFn: contarAlimentos })
export const useReceitas = (busca: string, tag: string) =>
  useQuery({
    queryKey: ['receitas', busca, tag],
    queryFn: () => listarReceitas(busca, tag),
    placeholderData: keepPreviousData,
  })
export const useTags = () => useQuery({ queryKey: ['receitas-tags'], queryFn: listarTags })
export const useReceita = (id?: string) =>
  useQuery({
    queryKey: ['receita', id],
    queryFn: () => buscarReceita(id ?? ''),
    enabled: Boolean(id),
  })
export const useRefeicoes = (busca: string, tipo: string) =>
  useQuery({
    queryKey: ['refeicoes', busca, tipo],
    queryFn: () => listarRefeicoes(busca, tipo),
    placeholderData: keepPreviousData,
  })
export const useCardapios = (busca: string, objetivo: string) =>
  useQuery({
    queryKey: ['cardapios', busca, objetivo],
    queryFn: () => listarCardapios(busca, objetivo),
    placeholderData: keepPreviousData,
  })
export const useCardapio = (id?: string) =>
  useQuery({
    queryKey: ['cardapio', id],
    queryFn: () => buscarCardapio(id ?? ''),
    enabled: Boolean(id),
  })

/** Mutação que atualiza todas as listas do plano ao terminar. */
export function useAcaoPlano<E, S>(fn: (dados: E) => Promise<S>) {
  const cliente = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: () => cliente.invalidateQueries() })
}
