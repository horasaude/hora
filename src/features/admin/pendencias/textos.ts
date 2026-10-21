// Textos da lista "O que ela já fez" na ficha da aluna.

export const t = {
  titulo: 'O que ela já fez',
  feito: 'Feito',
  andamento: 'Começou',
  falta: 'Falta',
  lembrar: 'Lembrar',
  lembrando: 'Lembrando',
  lembrada: (quando: string) => `Lembrada em ${quando}`,
  erro: 'Não foi possível lembrar. Tente de novo.',
  vazio: 'Sem tarefas para esta conta.',
}
