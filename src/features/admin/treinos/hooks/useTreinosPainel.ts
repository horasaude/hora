import { listarAnamneses, respostasDaAluna } from '../api/anamnese.api'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  buscarTreino,
  listarExercicios,
  listarFavoritos,
  listarRotinas,
  marcarFavorito,
  listarTreinos,
  resumoTreinos,
} from '../api/treinos.api'

export const useExercicios = (busca = '', grupo = '', equipamento = '') =>
  useQuery({
    queryKey: ['exercicios', busca, grupo, equipamento],
    queryFn: () => listarExercicios(busca, grupo, equipamento),
    placeholderData: keepPreviousData,
  })
export const useTreinosPainel = () =>
  useQuery({ queryKey: ['treinos-painel'], queryFn: listarTreinos })
export const useTreinoPainel = (id?: string) =>
  useQuery({
    queryKey: ['treino-painel', id],
    queryFn: () => buscarTreino(id ?? ''),
    enabled: Boolean(id),
  })
export const useFavoritos = () =>
  useQuery({ queryKey: ['exercicios-favoritos'], queryFn: listarFavoritos })

/** Estrela do exercício: marca e desmarca favorito, sem recarregar o resto. */
export function useMarcarFavorito() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: marcarFavorito,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['exercicios-favoritos'] }),
  })
}
export const useRotinas = () => useQuery({ queryKey: ['rotinas'], queryFn: listarRotinas })
export const useResumoTreinos = () =>
  useQuery({ queryKey: ['resumo-treinos'], queryFn: resumoTreinos })

/** Mutação que atualiza as listas de treinos ao terminar. */
export function useAcaoTreinos<E, S>(fn: (dados: E) => Promise<S>) {
  const cliente = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: () => cliente.invalidateQueries() })
}

export const useAnamneses = () => useQuery({ queryKey: ['anamneses'], queryFn: listarAnamneses })
export const useRespostasDaAluna = (perfil: string) =>
  useQuery({ queryKey: ['anamnese-aluna', perfil], queryFn: () => respostasDaAluna(perfil) })
