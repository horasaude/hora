// Lista de compras do cardápio: soma as quantidades da semana por alimento e agrupa por tipo.
import type { Refeicao } from './nutricao'

export const GRUPOS_COMPRA = ['Hortifruti', 'Proteínas', 'Laticínios', 'Grãos', 'Outros'] as const
export type GrupoCompra = (typeof GRUPOS_COMPRA)[number]

const MAPA: Record<string, GrupoCompra> = {
  'Verduras, hortaliças e derivados': 'Hortifruti',
  'Frutas e derivados': 'Hortifruti',
  'Carnes e derivados': 'Proteínas',
  'Pescados e frutos do mar': 'Proteínas',
  'Ovos e derivados': 'Proteínas',
  'Leite e derivados': 'Laticínios',
  'Cereais e derivados': 'Grãos',
  'Leguminosas e derivados': 'Grãos',
  'Nozes e sementes': 'Grãos',
}

/** Grupo da TACO (ou do alimento próprio) para o grupo da lista de compras. */
export const grupoDeCompra = (grupo: string): GrupoCompra => MAPA[grupo] ?? 'Outros'

export type LinhaCompra = { nome: string; quantidade: string }
export type ListaCompras = { grupo: GrupoCompra; itens: LinhaCompra[] }[]

/** Ingredientes de uma porção de receita (para abrir receitas usadas no cardápio). */
export type IngredientesPorPorcao = Map<string, { nome: string; grupo: string; gramas: number }[]>

export function formatarGramas(g: number): string {
  if (g >= 1000) return `${(g / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg`
  return `${Math.round(g)} g`
}

/** Soma a opção principal de cada item das refeições (receitas viram seus ingredientes) vezes os dias. */
export function listaDeCompras(
  refeicoes: Refeicao[],
  receitas: IngredientesPorPorcao,
  dias = 7,
): ListaCompras {
  const soma = new Map<string, { nome: string; grupo: string; gramas: number }>()
  const somar = (nome: string, grupo: string, gramas: number) => {
    const atual = soma.get(nome)
    soma.set(nome, { nome, grupo, gramas: (atual?.gramas ?? 0) + gramas })
  }
  for (const r of refeicoes) {
    for (const item of r.itens) {
      const o = item.opcoes[0]
      if (!o) continue
      if (o.tipo === 'alimento') somar(o.nome, o.grupo, o.gramas * dias)
      else
        for (const ing of receitas.get(o.ref_id) ?? [])
          somar(ing.nome, ing.grupo, ing.gramas * o.quantidade * dias)
    }
  }
  return GRUPOS_COMPRA.map((grupo) => ({
    grupo,
    itens: [...soma.values()]
      .filter((x) => grupoDeCompra(x.grupo) === grupo)
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
      .map((x) => ({ nome: x.nome, quantidade: formatarGramas(x.gramas) })),
  })).filter((g) => g.itens.length > 0)
}
