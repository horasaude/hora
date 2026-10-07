import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  buscarMarcados,
  ingredientesDeReceitas,
  listarCardapios,
  marcarItem,
} from '../api/cardapios.api'
import { buscarReceita, favoritar, listarReceitas } from '../api/receitas.api'

export const useCardapios = () =>
  useQuery({ queryKey: ['cardapios-aluna'], queryFn: listarCardapios })

export const useIngredientes = (ids: string[]) =>
  useQuery({ queryKey: ['ingredientes-receitas', ids], queryFn: () => ingredientesDeReceitas(ids) })

export const useMarcados = (cardapio: string) =>
  useQuery({ queryKey: ['lista-marcados', cardapio], queryFn: () => buscarMarcados(cardapio) })

/** Marcar item da lista: muda na hora e confirma no banco. */
export function useMarcarItem(cardapio: string) {
  const cliente = useQueryClient()
  const chave = ['lista-marcados', cardapio]
  return useMutation({
    mutationFn: (v: { item: string; marcado: boolean }) => marcarItem(cardapio, v.item, v.marcado),
    onMutate: (v) => {
      const antes = cliente.getQueryData<string[]>(chave) ?? []
      cliente.setQueryData(
        chave,
        v.marcado ? [...antes, v.item] : antes.filter((x) => x !== v.item),
      )
      return { antes }
    },
    onError: (_e, _v, ctx) => cliente.setQueryData(chave, ctx?.antes),
    onSettled: () => cliente.invalidateQueries({ queryKey: chave }),
  })
}

export const useReceitas = () => useQuery({ queryKey: ['receitas-aluna'], queryFn: listarReceitas })

export const useReceita = (id: string) =>
  useQuery({ queryKey: ['receita-aluna', id], queryFn: () => buscarReceita(id) })

export function useFavoritar(id: string) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (favorita: boolean) => favoritar(id, favorita),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ['receita-aluna', id] })
      cliente.invalidateQueries({ queryKey: ['receitas-aluna'] })
    },
  })
}
