// Regras do pagamento que rodam no servidor (Edge Functions). Sem Deno e sem rede, para testar no Vitest.
// Os preços seguem src/domain/precos.ts; o teste regras.test.ts confere que as duas contas batem.

export const PLANOS = ['pix', 'parcelado', 'recorrente'] as const
export type Plano = (typeof PLANOS)[number]

/** Linha da tabela configuracoes (valores em centavos; janela da oferta em UTC). */
export type ConfiguracaoPrecos = {
  pix_cheio: number
  parcelado_cheio: number
  recorrente_cheio: number
  pix_oferta: number
  parcelado_oferta: number
  recorrente_oferta: number
  oferta_inicio: string
  oferta_fim: string
}

export type PrecoPedido = {
  /** Pix: total. Parcelado: total das 12 parcelas. Recorrente: valor de cada mês. */
  valorCentavos: number
  parcelas: number
  oferta: boolean
  mesesAcesso: 12 | 13
}

export function emOferta(agora: Date, c: ConfiguracaoPrecos): boolean {
  const t = agora.getTime()
  return t >= new Date(c.oferta_inicio).getTime() && t <= new Date(c.oferta_fim).getTime()
}

/** Preço decidido no servidor: oferta do ORA só dentro da janela configurada (24/10, horário de Brasília). */
export function precoPedido(plano: Plano, agora: Date, c: ConfiguracaoPrecos): PrecoPedido {
  const oferta = emOferta(agora, c)
  const mesesAcesso = oferta ? 13 : 12
  if (plano === 'pix')
    return { valorCentavos: oferta ? c.pix_oferta : c.pix_cheio, parcelas: 1, oferta, mesesAcesso }
  if (plano === 'parcelado') {
    const parcela = oferta ? c.parcelado_oferta : c.parcelado_cheio
    return { valorCentavos: parcela * 12, parcelas: 12, oferta, mesesAcesso }
  }
  const mensal = oferta ? c.recorrente_oferta : c.recorrente_cheio
  return { valorCentavos: mensal, parcelas: 12, oferta, mesesAcesso }
}

/** Fim do acesso: aprovação + 12 meses (13 com a oferta do dia 24/10). */
export function fimDoAcesso(aprovadoEm: Date, meses: 12 | 13): Date {
  const fim = new Date(aprovadoEm)
  fim.setUTCMonth(fim.getUTCMonth() + meses)
  return fim
}

/** Centavos para o número em reais que a API do Mercado Pago espera. */
export const reais = (centavos: number): number => Math.round(centavos) / 100

/** Data no formato da API (yyyy-MM-ddTHH:mm:ss.SSS-03:00), no horário de Brasília. */
export function dataMp(d: Date): string {
  const b = new Date(d.getTime() - 3 * 3_600_000)
  return b.toISOString().replace('Z', '-03:00')
}

export const PIX_MINUTOS = 30
export const LEMBRETE_PIX_MINUTOS = 15

export function cpfValido(valor: string): boolean {
  const d = valor.replace(/\D/g, '')
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  const digito = (ate: number) => {
    let soma = 0
    for (let i = 0; i < ate; i++) soma += Number(d[i]) * (ate + 1 - i)
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }
  return digito(9) === Number(d[9]) && digito(10) === Number(d[10])
}
