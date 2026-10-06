/**
 * Oferta do ORA: só no dia do evento, 24/10/2026, de 00h00 a 23h59m59s em Brasília (UTC-3).
 * Antes e depois desse dia valem os preços cheios.
 */
export const INICIO_OFERTA_ORA = new Date('2026-10-24T03:00:00Z')
export const FIM_OFERTA_ORA = new Date('2026-10-25T02:59:59Z')

export type EstadoOferta = 'antes' | 'durante' | 'depois'

export function estadoOferta(agora: Date): EstadoOferta {
  const t = agora.getTime()
  if (t < INICIO_OFERTA_ORA.getTime()) return 'antes'
  if (t <= FIM_OFERTA_ORA.getTime()) return 'durante'
  return 'depois'
}

export function ofertaOraDisponivel(agora: Date): boolean {
  return estadoOferta(agora) === 'durante'
}
