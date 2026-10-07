// Estado da página da receita e a conversão de/para o banco.
import type { ReceitaCompleta } from './api/receitas.api'
import type { IngredienteLocal } from './components/IngredientesCalculados'
import { por100De } from './opcoes'

export type FormReceita = {
  nome: string
  foto_path: string | null
  ingredientes: string
  preparo: string
  porcoes: number
  tags: string
  tempo: string
  refeicoes: string[]
  objetivos: string[]
  calcular: boolean
  itens: IngredienteLocal[]
  publicado: boolean
}

export function deReceita(r?: ReceitaCompleta): FormReceita {
  return {
    nome: r?.nome ?? '',
    foto_path: r?.foto_path ?? null,
    ingredientes: r?.ingredientes ?? '',
    preparo: r?.preparo ?? '',
    porcoes: r?.porcoes ?? 1,
    tags: (r?.tags ?? []).join(', '),
    tempo: r?.tempo_minutos ? String(r.tempo_minutos) : '',
    refeicoes: r?.refeicoes ?? [],
    objetivos: r?.objetivos ?? [],
    calcular: r?.calcular ?? false,
    itens: (r?.receita_itens ?? []).map((i) => ({
      alimento_id: i.alimento_id,
      nome: i.alimentos.nome,
      gramas: i.gramas,
      por100: por100De(i.alimentos),
    })),
    publicado: r?.publicado ?? false,
  }
}

/** Tags digitadas separadas por vírgula, sem repetidas e sem vazias. */
export const lerTags = (texto: string) =>
  [
    ...new Set(
      texto
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  ].slice(0, 20)

export function paraBanco(f: FormReceita, id?: string) {
  return {
    dados: {
      id,
      nome: f.nome.trim(),
      foto_path: f.foto_path,
      ingredientes: f.ingredientes,
      preparo: f.preparo,
      porcoes: Math.min(Math.max(Math.round(f.porcoes) || 1, 1), 100),
      tags: lerTags(f.tags),
      tempo_minutos: /^[1-9]\d{0,3}$/.test(f.tempo.trim()) ? Math.min(Number(f.tempo), 1440) : null,
      refeicoes: f.refeicoes,
      objetivos: f.objetivos,
      calcular: f.calcular,
      publicado: f.publicado,
    },
    itens: f.calcular
      ? f.itens
          .filter((i) => i.gramas > 0)
          .map((i) => ({ alimento_id: i.alimento_id, gramas: i.gramas }))
      : [],
  }
}
