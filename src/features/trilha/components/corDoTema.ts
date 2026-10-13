// Cor de vidro de cada tema, pela chave fixa.

const TOM: Record<string, string> = {
  emagrecimento: 'brilho-verde',
  composicao: 'brilho-coral',
  lipedema: 'brilho-lilas',
  menopausa: 'brilho-rosa',
  ganho_massa: 'brilho-dourado',
}

const CORES = ['verde', 'coral', 'dourado', 'lilas', 'rosa', 'escuro']

/** Classe de vidro da cor do tema: a escolhida no painel ou a fixa pela chave. */
export const tomDoTema = (chave: string | null, cor?: string | null) =>
  cor && CORES.includes(cor) ? `brilho-${cor}` : (TOM[chave ?? ''] ?? 'brilho-escuro')
