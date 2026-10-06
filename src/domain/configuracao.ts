// Preços e janela da oferta do ORA. Os valores valem do banco (tabela configuracoes, editada no painel);
// CONFIGURACAO_PADRAO é o que a página usa até a resposta chegar ou se o banco não responder.

/** Centavos: pix à vista; parcelado e recorrente são o valor de cada uma das 12 parcelas. */
export type TabelaPrecos = { pix: number; parcelado: number; recorrente: number }

export type Configuracao = {
  cheio: TabelaPrecos
  oferta: TabelaPrecos
  ofertaInicio: Date
  ofertaFim: Date
}

export const CONFIGURACAO_PADRAO: Configuracao = {
  cheio: { pix: 229700, parcelado: 22700, recorrente: 24700 },
  oferta: { pix: 199700, parcelado: 19800, recorrente: 21500 },
  ofertaInicio: new Date('2026-10-24T03:00:00Z'),
  ofertaFim: new Date('2026-10-25T02:59:59Z'),
}
