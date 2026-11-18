import { useState } from 'react'
import { janelaDaLive } from '@/domain/lives'
import { useAgora, useLives } from './useLives'

const CHAVE = 'ora-lives-vistas'

function lerVistas(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) ?? '[]')
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

/** A próxima live que ela ainda não viu neste aparelho (o aviso aparece uma vez por live). */
export function useLiveNova() {
  const lives = useLives()
  const agora = useAgora(60_000)
  const [vistas, setVistas] = useState(lerVistas)
  const live =
    (lives.data ?? []).find(
      (l) =>
        !vistas.includes(l.id) &&
        janelaDaLive(new Date(l.data), l.duracao_minutos, agora) !== 'encerrada',
    ) ?? null
  const fechar = (id: string) => {
    const novas = [...new Set([...vistas, id])].slice(-50)
    setVistas(novas)
    try {
      localStorage.setItem(CHAVE, JSON.stringify(novas))
    } catch {
      // sem armazenamento: some só nesta visita
    }
  }
  return { live, fechar }
}
