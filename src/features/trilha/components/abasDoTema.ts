// Abas da página do tema e a cor de cada uma.

export const CORES_ABAS = {
  aulas: 'verde',
  cardapio: 'coral',
  treinos: 'dourado',
  desafio: 'lilas',
  materiais: 'rosa',
} as const
export type AbaTema = keyof typeof CORES_ABAS
export const ABAS_TEMA = Object.keys(CORES_ABAS) as AbaTema[]
export const ehAbaTema = (v: string | null): v is AbaTema => ABAS_TEMA.some((a) => a === v)
