import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  buscarDuvida,
  listarDuvidas,
  minhasRespondidas,
  regrasAceitas,
  type Filtro,
} from '../api/forum.api'

export const useDuvidas = (f: Filtro) =>
  useQuery({
    queryKey: ['forum', 'lista', f],
    queryFn: () => listarDuvidas(f),
    placeholderData: keepPreviousData,
  })
export const useDuvida = (id: string) =>
  useQuery({ queryKey: ['forum', 'duvida', id], queryFn: () => buscarDuvida(id) })
export const useRegrasAceitas = () =>
  useQuery({ queryKey: ['forum-regras'], queryFn: regrasAceitas })
export const useMinhasRespondidas = () =>
  useQuery({ queryKey: ['forum', 'respondidas'], queryFn: minhasRespondidas })

/** Mutação do fórum: ao terminar, atualiza listas, conversa e aviso. */
export function useAcaoForum<E, S>(fn: (d: E) => Promise<S>) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ['forum'] })
      cliente.invalidateQueries({ queryKey: ['forum-regras'] })
    },
  })
}
