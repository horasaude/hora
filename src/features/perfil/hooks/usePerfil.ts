import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apagarMedida, buscarMedidas, registrarMedida, type NovaMedida } from '../api/medidas.api'
import {
  contarAulasConcluidas,
  linkAvatar,
  salvarPerfil,
  salvarRanking,
  trocarSenha,
  type EdicaoPerfil,
} from '../api/perfil.api'
import { buscarHistorico, buscarIndicacoes } from '../api/pontos.api'

export const useAulasConcluidas = () =>
  useQuery({ queryKey: ['aulas-concluidas-total'], queryFn: contarAulasConcluidas })

export const useAvatar = (caminho: string | null | undefined) =>
  useQuery({
    queryKey: ['avatar', caminho],
    queryFn: () => linkAvatar(caminho ?? null),
    enabled: Boolean(caminho),
    staleTime: 50 * 60_000,
  })

/** Mutação que, ao dar certo, recarrega o perfil e o ranking. */
function usePerfilMutacao<T>(fn: (d: T) => Promise<void>) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ['meu-perfil'] })
      cliente.invalidateQueries({ queryKey: ['ranking'] })
    },
  })
}

export const useSalvarPerfil = () => usePerfilMutacao((d: EdicaoPerfil) => salvarPerfil(d))
export const useSalvarRanking = () =>
  usePerfilMutacao((aparecer: boolean) => salvarRanking(aparecer))
export const useTrocarSenha = () => useMutation({ mutationFn: trocarSenha })

export const useMedidas = () => useQuery({ queryKey: ['medidas'], queryFn: buscarMedidas })

export function useRegistrarMedida() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (d: NovaMedida) => registrarMedida(d),
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['medidas'] }),
  })
}

export function useApagarMedida() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: apagarMedida,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['medidas'] }),
  })
}

export const useIndicacoes = () =>
  useQuery({ queryKey: ['minhas-indicacoes'], queryFn: buscarIndicacoes })

export const useHistorico = (pagina: number, tamanho: number) =>
  useQuery({
    queryKey: ['meus-pontos', pagina, tamanho],
    queryFn: () => buscarHistorico(pagina, tamanho),
    placeholderData: keepPreviousData,
  })
