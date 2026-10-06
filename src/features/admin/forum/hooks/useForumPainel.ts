import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { buscarDuvida } from '@/features/forum'
import {
  listarAulasSimples,
  listarDenuncias,
  listarFila,
  meuPerfilEquipe,
  resumoForum,
  type FiltroFila,
} from '../api/forum.api'

export const useResumoForum = () =>
  useQuery({ queryKey: ['forum', 'resumo'], queryFn: resumoForum })
export const useFila = (f: FiltroFila) =>
  useQuery({
    queryKey: ['forum', 'fila', f],
    queryFn: () => listarFila(f),
    placeholderData: keepPreviousData,
  })
export const useAulasSimples = () =>
  useQuery({ queryKey: ['aulas-simples'], queryFn: listarAulasSimples })
export const useDenuncias = () =>
  useQuery({ queryKey: ['forum', 'denuncias'], queryFn: listarDenuncias })
export const useDuvidaPainel = (id: string) =>
  useQuery({ queryKey: ['forum', 'duvida', id], queryFn: () => buscarDuvida(id) })
export const useMeuPerfilEquipe = () =>
  useQuery({ queryKey: ['perfil-equipe'], queryFn: meuPerfilEquipe })

/** Mutação do fórum no painel: atualiza resumo, fila, conversa e denúncias. */
export function useAcaoForumPainel<E, S>(fn: (d: E) => Promise<S>) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ['forum'] })
      cliente.invalidateQueries({ queryKey: ['perfil-equipe'] })
    },
  })
}
