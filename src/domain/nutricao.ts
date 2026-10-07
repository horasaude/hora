// Cálculo nutricional do plano alimentar: valores por 100 g (TACO e alimentos próprios) viram
// nutrientes da quantidade escolhida, somados por refeição, cardápio e porção de receita.

export type Nutrientes = {
  kcal: number
  proteina: number
  carboidrato: number
  gordura: number
  fibra: number
}
export type Por100 = { [K in keyof Nutrientes]: number | null }

export const ZERO: Nutrientes = { kcal: 0, proteina: 0, carboidrato: 0, gordura: 0, fibra: 0 }
const CHAVES = Object.keys(ZERO) as (keyof Nutrientes)[]

/** Sem valor (NA, Tr, * da TACO) conta como zero; negativo (carboidrato por diferença) também. */
const valor = (v: number | null) => (v === null || v < 0 ? 0 : v)

/** Nutrientes de uma quantidade em gramas de um alimento com valores por 100 g. */
export function nutrientesDe(por100: Por100, gramas: number): Nutrientes {
  const fator = Math.max(gramas, 0) / 100
  return Object.fromEntries(CHAVES.map((k) => [k, valor(por100[k]) * fator])) as Nutrientes
}

export function somar(lista: Nutrientes[]): Nutrientes {
  return lista.reduce(
    (t, n) => Object.fromEntries(CHAVES.map((k) => [k, t[k] + n[k]])) as Nutrientes,
    ZERO,
  )
}

export function multiplicar(n: Nutrientes, fator: number): Nutrientes {
  return Object.fromEntries(CHAVES.map((k) => [k, n[k] * fator])) as Nutrientes
}

export type Macro = { gramas: number; pct: number }

/** Gramas e porcentagem das calorias de cada macro (proteína e carboidrato 4 kcal/g, gordura 9 kcal/g). */
export function macros(n: Nutrientes): { proteina: Macro; carboidrato: Macro; gordura: Macro } {
  const kcal = { proteina: n.proteina * 4, carboidrato: n.carboidrato * 4, gordura: n.gordura * 9 }
  const total = kcal.proteina + kcal.carboidrato + kcal.gordura
  const pct = (x: number) => (total > 0 ? Math.round((x / total) * 100) : 0)
  return {
    proteina: { gramas: n.proteina, pct: pct(kcal.proteina) },
    carboidrato: { gramas: n.carboidrato, pct: pct(kcal.carboidrato) },
    gordura: { gramas: n.gordura, pct: pct(kcal.gordura) },
  }
}

/** Uma opção de um item de refeição: alimento (em medida caseira ou gramas) ou receita (em porções). */
export type Opcao = {
  tipo: 'alimento' | 'receita'
  ref_id: string
  nome: string
  grupo: string
  medida: string
  gramas_medida: number
  quantidade: number
  gramas: number
  nutrientes: Nutrientes
}

/** Item da refeição: a primeira opção é a principal; as outras são o "ou". */
export type Item = { opcoes: Opcao[] }
export type Substituta = { id: string; nome: string; itens: Item[]; texto: string }
export type Refeicao = {
  id: string
  nome: string
  horario: string
  itens: Item[]
  texto: string
  observacao: string
  substitutas: Substituta[]
}

/** Total de uma lista de itens: conta só a opção principal de cada item. */
export function totalItens(itens: Item[]): Nutrientes {
  return somar(itens.flatMap((i) => (i.opcoes[0] ? [i.opcoes[0].nutrientes] : [])))
}

/** Total do dia: soma as refeições (as substitutas não entram). */
export function totalCardapio(refeicoes: Refeicao[]): Nutrientes {
  return somar(refeicoes.map((r) => totalItens(r.itens)))
}

/** Nutrientes por porção de uma receita a partir dos ingredientes. */
export function porPorcao(
  ingredientes: { por100: Por100; gramas: number }[],
  porcoes: number,
): Nutrientes {
  return multiplicar(
    somar(ingredientes.map((i) => nutrientesDe(i.por100, i.gramas))),
    1 / Math.max(porcoes, 1),
  )
}

const fmt = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

/** Como a quantidade aparece: "120 g", "2 x 1 colher de sopa (44 g)" ou "1 porção". */
export function rotuloOpcao(o: Opcao): string {
  if (o.tipo === 'receita')
    return `${fmt(o.quantidade)} ${o.quantidade === 1 ? 'porção' : 'porções'}`
  if (o.medida === 'g') return `${fmt(o.gramas)} g`
  return `${fmt(o.quantidade)} x ${o.medida} (${fmt(o.gramas)} g)`
}
