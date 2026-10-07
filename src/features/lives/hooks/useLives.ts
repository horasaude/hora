import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { janelaDaLive } from '@/domain/lives'
import { diaEmBrasilia } from '@/lib/datas'
import { alternarLembrete, entrarLive, listarLives } from '../api/lives.api'

export const useLives = () => useQuery({ queryKey: ['lives-aluna'], queryFn: listarLives })

/** Relógio que anda a cada 30 segundos (contagem e janela de entrar). */
export function useAgora(intervalo = 30_000) {
  const [agora, setAgora] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), intervalo)
    return () => clearInterval(id)
  }, [intervalo])
  return agora
}

export function useLembrete() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (v: { live: string; ligar: boolean }) => alternarLembrete(v.live, v.ligar),
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['lives-aluna'] }),
  })
}

/** Entrar na live: abre a aba já no clique (para o navegador não bloquear) e leva para a sala. */
export function useEntrarLive() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: async (live: string) => {
      const aba = window.open('', '_blank')
      try {
        const r = await entrarLive(live)
        if (r.link && aba) aba.location.href = r.link
        else aba?.close()
        return r
      } catch (e) {
        aba?.close()
        throw e
      }
    },
    onSuccess: () => {
      for (const chave of ['lives-aluna', 'ranking', 'ultimo-ponto', 'meus-pontos']) {
        cliente.invalidateQueries({ queryKey: [chave] })
      }
    },
  })
}

/** Há live hoje (Brasília) que ainda não acabou: acende o ponto dourado na navegação. */
export function useTemLiveHoje() {
  const lives = useLives()
  const agora = useAgora(60_000)
  const hoje = diaEmBrasilia(agora)
  return Boolean(
    lives.data?.some(
      (l) =>
        diaEmBrasilia(new Date(l.data)) === hoje &&
        janelaDaLive(new Date(l.data), l.duracao_minutos, agora) !== 'encerrada',
    ),
  )
}
