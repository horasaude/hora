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
