import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listarAvisos, listarLives } from '../api/agenda.api'
import {
  alternarPublicado,
  buscarAula,
  buscarTema,
  listarSituacaoAulas,
  listarTemas,
  mover,
  type TabelaConteudo,
} from '../api/conteudo.api'

export const useTemas = () => useQuery({ queryKey: ['temas'], queryFn: listarTemas })
export const useTema = (id: string) =>
  useQuery({ queryKey: ['tema', id], queryFn: () => buscarTema(id) })
export const useSituacaoAulas = () =>
  useQuery({ queryKey: ['aulas-situacao'], queryFn: listarSituacaoAulas })
export const useAula = (id?: string) =>
  useQuery({ queryKey: ['aula', id], queryFn: () => buscarAula(id ?? ''), enabled: Boolean(id) })
export const useLives = () => useQuery({ queryKey: ['lives'], queryFn: listarLives })
export const useAvisos = () => useQuery({ queryKey: ['avisos'], queryFn: listarAvisos })

/** Publicar, tirar do ar e mudar a ordem; depois atualiza as listas. */
export function useAcoes() {
  const cliente = useQueryClient()
  const atualizar = () => cliente.invalidateQueries()
  const publicar = useMutation({
    mutationFn: (v: { tabela: TabelaConteudo; id: string; publicado: boolean }) =>
      alternarPublicado(v.tabela, v.id, v.publicado),
    onSuccess: atualizar,
  })
  const ordenar = useMutation({
    mutationFn: (v: { tipo: 'tema' | 'etapa' | 'aula'; id: string; direcao: 1 | -1 }) =>
      mover(v.tipo, v.id, v.direcao),
    onSuccess: atualizar,
  })
  return { publicar, ordenar }
}

/** Mutação de salvar que atualiza as listas ao terminar. */
export function useSalvar<E, S>(salvar: (dados: E) => Promise<S>) {
  const cliente = useQueryClient()
  return useMutation({ mutationFn: salvar, onSuccess: () => cliente.invalidateQueries() })
}
