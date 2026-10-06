import { CONFIGURACAO_PADRAO, type Configuracao } from './configuracao'

/**
 * Oferta do ORA: por padrão só no dia do evento, 24/10/2026, de 00h00 a 23h59m59s em Brasília (UTC-3).
 * A janela vem da configuração (painel); antes e depois dela valem os preços cheios.
 */
export const INICIO_OFERTA_ORA = CONFIGURACAO_PADRAO.ofertaInicio
export const FIM_OFERTA_ORA = CONFIGURACAO_PADRAO.ofertaFim

type Janela = Pick<Configuracao, 'ofertaInicio' | 'ofertaFim'>

export type EstadoOferta = 'antes' | 'durante' | 'depois'

export function estadoOferta(agora: Date, c: Janela = CONFIGURACAO_PADRAO): EstadoOferta {
  const t = agora.getTime()
  if (t < c.ofertaInicio.getTime()) return 'antes'
  if (t <= c.ofertaFim.getTime()) return 'durante'
  return 'depois'
}

export function ofertaOraDisponivel(agora: Date, c: Janela = CONFIGURACAO_PADRAO): boolean {
  return estadoOferta(agora, c) === 'durante'
}
