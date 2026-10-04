/** Fim da oferta do ORA: 24/10/2026 23h59m59s em Brasília (UTC-3). */
export const FIM_OFERTA_ORA = new Date('2026-10-25T02:59:59Z')

export function ofertaOraDisponivel(agora: Date): boolean {
  return agora.getTime() <= FIM_OFERTA_ORA.getTime()
}
