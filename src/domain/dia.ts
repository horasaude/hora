// Dia da aluna: o dia 1 é o dia da adesão (pagamento aprovado) no calendário de Brasília.
// A mesma conta existe no banco (public.dia_atual_de); as duas precisam andar juntas.

const FUSO = 'America/Sao_Paulo'

/** Data AAAA-MM-DD do instante no fuso de Brasília. */
function dataBrasilia(instante: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: FUSO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instante)
}

/** dia_atual = dias de calendário desde a adesão + 1 (muda à meia-noite de Brasília). */
export function diaAtual(adesao: Date, agora: Date): number {
  const dias =
    (Date.parse(`${dataBrasilia(agora)}T00:00:00Z`) -
      Date.parse(`${dataBrasilia(adesao)}T00:00:00Z`)) /
    86_400_000
  return Math.round(dias) + 1
}

export const DIAS_NO_ANO = 365
