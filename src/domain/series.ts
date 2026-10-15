// Séries de um exercício (série por série, como no MFIT) e o próximo treino da rotina numérica.

export type Serie = { repeticoes: string; carga: string; descanso_segundos: number }

type ItemComSeries = {
  series: number
  repeticoes: string
  carga: string
  descanso_segundos: number
  series_detalhe: unknown
}

const ehSerie = (x: unknown): x is Serie =>
  typeof x === 'object' &&
  x !== null &&
  typeof (x as Serie).repeticoes === 'string' &&
  typeof (x as Serie).descanso_segundos === 'number'

/** As séries do exercício: a lista série por série, ou N séries iguais. */
export function seriesDoItem(i: ItemComSeries): Serie[] {
  const detalhe = Array.isArray(i.series_detalhe) ? i.series_detalhe.filter(ehSerie) : []
  if (detalhe.length > 0) return detalhe.map((s) => ({ ...s, carga: s.carga ?? '' }))
  return Array.from({ length: i.series }, () => ({
    repeticoes: i.repeticoes,
    carga: i.carga,
    descanso_segundos: i.descanso_segundos,
  }))
}

/** "3 x 12" quando todas iguais; "15, 12, 10" quando mudam. */
export function resumoSeries(series: Serie[]): string {
  const reps = series.map((s) => s.repeticoes)
  if (reps.length === 0) return ''
  return reps.every((r) => r === reps[0]) ? `${reps.length} x ${reps[0]}` : reps.join(', ')
}

/** Copia a primeira série para todas (botão Replicar séries). */
export const replicarSeries = (series: Serie[]): Serie[] =>
  series.map(() => ({ ...(series[0] as Serie) }))

/**
 * Rotina numérica: o próximo é o que vem depois do último feito (volta ao primeiro no fim).
 * Se o último foi feito hoje, ele continua sendo o de hoje, já concluído.
 */
export function proximoDaSequencia(
  ordem: string[],
  feitos: { treino_id: string; data: string }[],
  hoje: string,
): { indice: number; feitoHoje: boolean } {
  if (ordem.length === 0) return { indice: -1, feitoHoje: false }
  const daRotina = feitos
    .filter((f) => ordem.includes(f.treino_id))
    .sort((a, b) => b.data.localeCompare(a.data))
  const ultimo = daRotina[0]
  if (!ultimo) return { indice: 0, feitoHoje: false }
  const i = ordem.indexOf(ultimo.treino_id)
  if (ultimo.data === hoje) return { indice: i, feitoHoje: true }
  return { indice: (i + 1) % ordem.length, feitoHoje: false }
}
