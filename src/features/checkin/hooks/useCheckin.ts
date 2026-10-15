import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { diasSeguidos, semanaDeSegunda, somarDias, ultimosSeteDias } from '@/domain/engajamento'
import { diaEmBrasilia } from '@/lib/datas'
import {
  buscarAguaHoje,
  buscarMeusCheckins,
  fazerCheckin,
  meusPontosDoDia,
  pontosDaSemana,
  registrarAgua,
  type NovoCheckin,
} from '../api/checkin.api'

/** Hoje no fuso de Brasília, fixo enquanto a tela está aberta. */
export function useHoje() {
  const [hoje] = useState(() => diaEmBrasilia(new Date()))
  return hoje
}

/** Check-ins dos últimos 60 dias (chave ['checkins']). */
export function useMeusCheckins() {
  const hoje = useHoje()
  return useQuery({
    queryKey: ['checkins', hoje],
    queryFn: () => buscarMeusCheckins(somarDias(hoje, -60), hoje),
  })
}

/** Dias seguidos com check-in e as bolinhas dos últimos 7 dias. */
export function useSequencia() {
  const hoje = useHoje()
  const q = useMeusCheckins()
  const dias = q.data?.dias ?? []
  return { ...q, seguidos: diasSeguidos(dias, hoje), semana: ultimosSeteDias(dias, hoje) }
}

const ATUALIZAR = [
  'checkins',
  'ranking',
  'ultimo-ponto',
  'meus-pontos',
  'pontos-semana',
  'pontos-do-dia',
  'agua',
]

/** Faz o check-in e atualiza check-ins, ranking e pontos. */
export function useFazerCheckin() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (d: NovoCheckin) => fazerCheckin(d),
    onSuccess: () => {
      for (const chave of ATUALIZAR) {
        cliente.invalidateQueries({ queryKey: [chave] })
      }
    },
  })
}

/** Pontos da semana no quadro de hábitos (segunda a domingo). */
export function usePontosDaSemana() {
  const hoje = useHoje()
  const desde = semanaDeSegunda(hoje)[0] ?? hoje
  return useQuery({ queryKey: ['pontos-semana', desde], queryFn: () => pontosDaSemana(desde) })
}

export function useAguaHoje() {
  const hoje = useHoje()
  return useQuery({ queryKey: ['agua', hoje], queryFn: () => buscarAguaHoje(hoje) })
}

/** Soma ou desfaz um copo e atualiza água, quadro, pontos e ranking. */
export function useRegistrarAgua() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: registrarAgua,
    onSuccess: () => {
      for (const chave of ATUALIZAR) cliente.invalidateQueries({ queryKey: [chave] })
    },
  })
}

export const usePontosDoDia = () =>
  useQuery({ queryKey: ['pontos-do-dia'], queryFn: meusPontosDoDia })
