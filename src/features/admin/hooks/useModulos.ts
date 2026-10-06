import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  buscarConfiguracoes,
  encerrarDesafio,
  listarAlunas,
  listarDesafios,
  listarVencedoras,
  numerosDesafios,
  salvarConfiguracoes,
} from '../api/modulos.api'

export const useDesafios = () => useQuery({ queryKey: ['desafios'], queryFn: listarDesafios })
export const useNumerosDesafios = () =>
  useQuery({ queryKey: ['desafios-numeros'], queryFn: numerosDesafios })
export const useVencedoras = (id: string, ligado: boolean) =>
  useQuery({ queryKey: ['vencedoras', id], queryFn: () => listarVencedoras(id), enabled: ligado })
export const useAlunas = () => useQuery({ queryKey: ['alunas'], queryFn: listarAlunas })
export const useConfiguracoes = () =>
  useQuery({ queryKey: ['configuracoes'], queryFn: buscarConfiguracoes })

/** Encerra o desafio; as listas e as vencedoras atualizam. */
export function useEncerrar() {
  const cliente = useQueryClient()
  return useMutation({ mutationFn: encerrarDesafio, onSuccess: () => cliente.invalidateQueries() })
}

export function useSalvarConfiguracoes() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: salvarConfiguracoes,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['configuracoes'] }),
  })
}
