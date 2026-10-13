// Cronômetro de descanso entre séries: guarda só o instante do fim, então não atrasa com a tela parada.

export type Descanso = { fim: number; total: number }

export function iniciarDescanso(segundos: number, agora: number): Descanso | null {
  if (!Number.isFinite(segundos) || segundos <= 0) return null
  return { fim: agora + segundos * 1000, total: segundos }
}

/** Segundos que faltam (arredondado para cima, nunca negativo). */
export function restanteDescanso(d: Descanso, agora: number): number {
  return Math.max(0, Math.ceil((d.fim - agora) / 1000))
}

export const descansoAcabou = (d: Descanso, agora: number) => restanteDescanso(d, agora) === 0

/** "1:05", "0:30". */
export function formatarTempo(segundos: number): string {
  const s = Math.max(0, Math.round(segundos))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
