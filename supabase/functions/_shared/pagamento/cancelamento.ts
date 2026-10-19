// Regra do cancelamento pedido pela aluna. Sem Deno e sem rede, para testar no Vitest.
// A mesma conta está em src/domain/cancelamento.ts (a tela mostra o que o servidor vai fazer).

export const DIAS_ARREPENDIMENTO = 7

/** Até 7 dias da aprovação: estorno integral automático. Depois: só deixa de renovar. */
export function dentroDoArrependimento(aprovadoEm: Date, agora: Date): boolean {
  return agora.getTime() < aprovadoEm.getTime() + DIAS_ARREPENDIMENTO * 86_400_000
}

export type TipoCancelamento = 'arrependimento' | 'nao_renovar'

export const tipoDeCancelamento = (aprovadoEm: Date, agora: Date): TipoCancelamento =>
  dentroDoArrependimento(aprovadoEm, agora) ? 'arrependimento' : 'nao_renovar'
