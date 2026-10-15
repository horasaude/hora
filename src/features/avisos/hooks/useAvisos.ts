import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listarAvisos } from '../api/avisos.api'

const CHAVE = 'ora-avisos-lidos'

function lerLidos(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) ?? '[]')
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

/** Avisos que ela ainda não fechou (o "Entendi" fica guardado neste aparelho). */
export function useAvisosNovos() {
  const q = useQuery({ queryKey: ['avisos'], queryFn: listarAvisos, staleTime: 5 * 60_000 })
  const [lidos, setLidos] = useState(lerLidos)
  const fechar = (id: string) => {
    const novos = [...new Set([...lidos, id])].slice(-50)
    setLidos(novos)
    try {
      localStorage.setItem(CHAVE, JSON.stringify(novos))
    } catch {
      // sem armazenamento: some só nesta visita
    }
  }
  return { avisos: (q.data ?? []).filter((a) => !lidos.includes(a.id)), fechar }
}
