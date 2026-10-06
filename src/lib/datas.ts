export const FUSO = 'America/Sao_Paulo'

/** Dia (AAAA-MM-DD) no fuso de Brasília para um instante. Base de check-ins e limites diários. */
export function diaEmBrasilia(instante: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: FUSO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instante)
}

/** Data por extenso curta, ex.: 24/10/2026. */
export function formatarData(instante: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO }).format(instante)
}

/** Valor do campo datetime-local (AAAA-MM-DDTHH:mm) mostrando o instante no horário de Brasília. */
export function paraCampoBrasilia(instante: Date): string {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: FUSO,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(instante)
      .map((x) => [x.type, x.value]),
  )
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`
}

/** Lê o campo datetime-local como horário de Brasília (UTC-3, sem horário de verão desde 2019). */
export function deCampoBrasilia(valor: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(valor)) return null
  const instante = new Date(`${valor}:00-03:00`)
  return Number.isNaN(instante.getTime()) ? null : instante
}

/** Data e hora curtas no horário de Brasília, ex.: 24/10/2026 19:00. */
export function formatarDataHora(instante: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO,
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(instante)
}
