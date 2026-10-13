import { CONFIGURACAO_PADRAO, type Configuracao } from './configuracao'
import { estadoOferta, ofertaOraDisponivel } from './oferta'

/** Valores em centavos. As parcelas são o valor de cada uma das 12. */
export type Precos = {
  /** Dia do evento (24/10): quem assina ganha o 13º mês. O preço com desconto vale sempre. */
  emOferta: boolean
  parcelas: number
  parceladoCentavos: number
  recorrenteCentavos: number
  pixCentavos: number
  mesesAcesso: number
  /** Preço de antes no Pix, mostrado riscado ("de ... por ..."). */
  ancoraCentavos: number | null
}

/**
 * Preços da tabela configurada: sempre os com desconto (a "oferta"), com o preço de antes riscado.
 * No dia do evento ORA, o acesso ganha o 13º mês; fora dele, 12 meses.
 */
export function precosPara(emOferta: boolean, c: Configuracao = CONFIGURACAO_PADRAO): Precos {
  const t = c.oferta
  return {
    emOferta,
    parcelas: 12,
    parceladoCentavos: t.parcelado,
    recorrenteCentavos: t.recorrente,
    pixCentavos: t.pix,
    mesesAcesso: emOferta ? 13 : 12,
    ancoraCentavos: c.cheio.pix,
  }
}

/** Desconto da oferta do ORA no Pix (o "R$ 400 OFF" da faixa). */
export function descontoOferta(c: Configuracao = CONFIGURACAO_PADRAO): number {
  return c.cheio.pix - c.oferta.pix
}

export const DESCONTO_OFERTA_CENTAVOS = descontoOferta()

/** Preços que valem no instante informado: com desconto sempre; 13º mês só dentro da janela. */
export function precosVigentes(agora: Date, c: Configuracao = CONFIGURACAO_PADRAO): Precos {
  return precosPara(ofertaOraDisponivel(agora, c), c)
}

export type TempoRestante = { dias: number; horas: number; minutos: number; segundos: number }

/** Contagem da oferta: até começar (antes do dia) ou até acabar (no dia). Depois, null. */
export type Contagem = { estado: 'antes' | 'durante'; tempo: TempoRestante }

function quebrar(ms: number): TempoRestante {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
  }
}

export function contagemOferta(
  agora: Date,
  c: Configuracao = CONFIGURACAO_PADRAO,
): Contagem | null {
  const estado = estadoOferta(agora, c)
  if (estado === 'depois') return null
  const alvo = estado === 'antes' ? c.ofertaInicio : c.ofertaFim
  return { estado, tempo: quebrar(alvo.getTime() - agora.getTime()) }
}

/** Formas de pagamento oferecidas na página. Mesma lista do banco (interessadas.plano_escolhido). */
export const PLANOS = ['pix', 'parcelado', 'recorrente'] as const
export type Plano = (typeof PLANOS)[number]
