import { useAgora } from '../hooks/useAgora'
import { FIM_BLACK } from './textos'

export type Tempo = { dias: number; horas: number; minutos: number; segundos: number }

/** Quanto falta para o fim da Black; null quando já acabou. */
export function useFaltaBlack(): Tempo | null {
  const ms = FIM_BLACK.getTime() - useAgora().getTime()
  if (ms <= 0) return null
  const s = Math.floor(ms / 1000)
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segundos: s % 60,
  }
}

export const dois = (n: number) => String(n).padStart(2, '0')
