// Cor de vidro de cada tema, pela chave fixa.

const TOM: Record<string, string> = {
  emagrecimento: 'brilho-verde',
  composicao: 'brilho-coral',
  lipedema: 'brilho-lilas',
  menopausa: 'brilho-rosa',
  ganho_massa: 'brilho-dourado',
}

/** Classe de vidro da cor do tema. */
export const tomDoTema = (chave: string | null) => TOM[chave ?? ''] ?? 'brilho-escuro'
