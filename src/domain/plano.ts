// Plano alimentar: tipos de refeição e objetivos (os mesmos nomes dos temas da trilha).

export const TIPOS_REFEICAO = {
  cafe: 'Café da manhã',
  lanche: 'Lanche',
  almoco: 'Almoço',
  jantar: 'Jantar',
  ceia: 'Ceia',
  pre_treino: 'Pré-treino',
  pos_treino: 'Pós-treino',
} as const

export type TipoRefeicao = keyof typeof TIPOS_REFEICAO

export const OBJETIVOS = [
  'Emagrecimento',
  'Composição corporal',
  'Lipedema',
  'Menopausa',
  'Ganho de massa',
] as const

export type Objetivo = (typeof OBJETIVOS)[number]

/** Temas do cardápio: a Preparação (dias 1 a 7 e enquanto não há tema) e os 5 temas. */
export const OBJETIVOS_CARDAPIO = ['Preparação', ...OBJETIVOS] as const

/** Objetivo do cardápio e da receita para cada tema da trilha (pela chave fixa do tema). */
export const OBJETIVO_DO_TEMA: Record<string, Objetivo> = {
  emagrecimento: 'Emagrecimento',
  composicao: 'Composição corporal',
  lipedema: 'Lipedema',
  menopausa: 'Menopausa',
  ganho_massa: 'Ganho de massa',
}
