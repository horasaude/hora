// Regras da Loja: categorias, desconto e preço final.

export const CATEGORIAS_LOJA = {
  suplementos: 'Suplementos',
  alimentacao: 'Alimentação',
  acessorios: 'Acessórios',
  outros: 'Outros',
} as const
export type CategoriaLoja = keyof typeof CATEGORIAS_LOJA
export const ehCategoriaLoja = (v: string): v is CategoriaLoja => v in CATEGORIAS_LOJA

/** Desconto em % inteiro, arredondado para baixo (nunca promete mais do que dá). */
export function percentualDesconto(cheio: number, final: number): number {
  if (cheio <= 0 || final >= cheio) return 0
  return Math.floor(((cheio - final) / cheio) * 100)
}

/** Preço final em centavos a partir do desconto em % (0 a 99). */
export function precoComDesconto(cheio: number, pct: number): number {
  const p = Math.min(99, Math.max(0, pct))
  return Math.max(1, Math.round(cheio * (1 - p / 100)))
}

type Ordenavel = { destaque: boolean; nome: string }

/** Vitrine: destaques primeiro, depois por nome. */
export function ordemVitrine<T extends Ordenavel>(lista: T[]): T[] {
  return [...lista].sort(
    (a, b) => Number(b.destaque) - Number(a.destaque) || a.nome.localeCompare(b.nome, 'pt-BR'),
  )
}
