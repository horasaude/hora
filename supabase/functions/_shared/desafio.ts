// Texto do lembrete do desafio às 19h (testável no Vitest).

/** Notificação curta: falta o check-in de hoje e, se houver, o prêmio em jogo. */
export function mensagemDesafio(
  desafio: string,
  nome: string,
  premio: string,
): { title: string; body: string; url: string; tag: string } {
  return {
    title: 'Falta o seu check-in de hoje',
    body: premio
      ? `${nome}: faça o check-in e não perca o prêmio (${premio}).`
      : `${nome}: faça o check-in e não perca o prêmio do mês.`,
    url: `/app/desafios/${desafio}`,
    tag: 'lembrete-desafio',
  }
}
