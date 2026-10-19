// Regra do cancelamento pedido pela aluna. A mesma conta roda no servidor
// (supabase/functions/_shared/pagamento/cancelamento.ts), que é quem decide de fato.

export const DIAS_ARREPENDIMENTO = 7

/** Até 7 dias da aprovação: estorno integral automático. Depois: só deixa de renovar. */
export function dentroDoArrependimento(aprovadoEm: Date, agora: Date): boolean {
  return agora.getTime() < aprovadoEm.getTime() + DIAS_ARREPENDIMENTO * 86_400_000
}
