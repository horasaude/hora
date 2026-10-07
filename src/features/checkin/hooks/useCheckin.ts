import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { diasSeguidos, somarDias, ultimosSeteDias } from '@/domain/engajamento'
import { diaEmBrasilia } from '@/lib/datas'
import { buscarMeusCheckins, fazerCheckin, type NovoCheckin } from '../api/checkin.api'

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

/** Faz o check-in e atualiza check-ins, ranking e pontos. */
export function useFazerCheckin() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (d: NovoCheckin) => fazerCheckin(d),
    onSuccess: () => {
      for (const chave of ['checkins', 'ranking', 'ultimo-ponto', 'meus-pontos']) {
        cliente.invalidateQueries({ queryKey: [chave] })
      }
    },
  })
}
