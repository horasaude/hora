// Texto do lembrete de água (testável no Vitest).

const litros = (ml: number) =>
  ml >= 1000 ? `${(ml / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} L` : `${ml} ml`

/** Notificação curta: quanto já bebeu e quanto falta para a meta do dia. */
export function mensagemAgua(
  total: number,
  meta: number,
): { title: string; body: string; url: string } {
  const falta = Math.max(0, meta - total)
  return {
    title: 'Hora de beber água',
    body:
      total === 0
        ? `Comece agora: a meta de hoje é ${litros(meta)}.`
        : `Você já bebeu ${litros(total)}. Faltam ${litros(falta)} para a meta.`,
    url: '/app',
    tag: 'lembrete-agua',
  }
}
