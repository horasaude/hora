import { FIM_OFERTA_ORA, ofertaOraDisponivel } from './oferta'

/** Valores em centavos. As parcelas são o valor de cada uma das 12. */
export type Precos = {
  emOferta: boolean
  parcelas: number
  parceladoCentavos: number
  recorrenteCentavos: number
  pixCentavos: number
  mesesAcesso: number
  /** Preço cheio no Pix, mostrado riscado só durante a oferta. */
  ancoraCentavos: number | null
}

const PRECOS_OFERTA: Precos = {
  emOferta: true,
  parcelas: 12,
  parceladoCentavos: 19800,
  recorrenteCentavos: 21500,
  pixCentavos: 199700,
  mesesAcesso: 13,
  ancoraCentavos: 229700,
}

const PRECOS_CHEIOS: Precos = {
  emOferta: false,
  parcelas: 12,
  parceladoCentavos: 22700,
  recorrenteCentavos: 24700,
  pixCentavos: 229700,
  mesesAcesso: 12,
  ancoraCentavos: null,
}

/** Desconto da oferta do ORA no Pix (o "R$ 300 OFF" da faixa). */
export const DESCONTO_OFERTA_CENTAVOS = PRECOS_CHEIOS.pixCentavos - PRECOS_OFERTA.pixCentavos

/** Preços que valem no instante informado: oferta do ORA até FIM_OFERTA_ORA, cheios depois. */
export function precosVigentes(agora: Date): Precos {
  return precosPara(ofertaOraDisponivel(agora))
}

/** Tabela de preços dentro ou fora da oferta (para quem já sabe se a oferta vale). */
export function precosPara(emOferta: boolean): Precos {
  return emOferta ? PRECOS_OFERTA : PRECOS_CHEIOS
}

export type TempoRestante = { dias: number; horas: number; minutos: number; segundos: number }

/** Quanto falta para o fim da oferta, ou null se já acabou. */
export function tempoRestanteOferta(agora: Date): TempoRestante | null {
  const ms = FIM_OFERTA_ORA.getTime() - agora.getTime()
  if (ms < 0) return null
  const total = Math.floor(ms / 1000)
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
  }
}

/** Formas de pagamento oferecidas na página. Mesma lista do banco (interessadas.plano_escolhido). */
export const PLANOS = ['pix', 'parcelado', 'recorrente'] as const
export type Plano = (typeof PLANOS)[number]
