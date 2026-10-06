import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  codigoIndicacao,
  listarAlunasSimples,
  listarFotos,
  listarIndicacoes,
  listarLancamentos,
  listarRegras,
  resumoPontos,
  type FiltroHistorico,
} from '../api/pontos.api'

export const useResumoPontos = () =>
  useQuery({ queryKey: ['pontos-resumo'], queryFn: resumoPontos })
export const useRegras = () => useQuery({ queryKey: ['regras-pontos'], queryFn: listarRegras })
export const useLancamentos = (f: FiltroHistorico) =>
  useQuery({
    queryKey: ['lancamentos', f],
    queryFn: () => listarLancamentos(f),
    placeholderData: keepPreviousData,
  })
export const useAlunasSimples = () =>
  useQuery({ queryKey: ['alunas-simples'], queryFn: listarAlunasSimples })
export const useFotos = () => useQuery({ queryKey: ['fotos-checkin'], queryFn: listarFotos })
export const useIndicacoes = () => useQuery({ queryKey: ['indicacoes'], queryFn: listarIndicacoes })
export const useCodigoIndicacao = (perfil: string) =>
  useQuery({ queryKey: ['codigo-indicacao', perfil], queryFn: () => codigoIndicacao(perfil) })

/** Mutação que atualiza tudo ao terminar (resumo, listas e histórico). */
export function useAcaoPontos<E, S>(fn: (d: E) => Promise<S>) {
  const cliente = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: () => cliente.invalidateQueries() })
}
