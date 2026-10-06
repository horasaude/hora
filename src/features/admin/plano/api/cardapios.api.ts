import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/database'
import type { IngredientesPorPorcao } from '@/domain/listaCompras'
import { ok } from '../../api/conteudo.api'
import { palavrasBusca } from './alimentos.api'

export type CardapioLinha = Tables<'cardapios'>
export type RefeicaoModelo = Tables<'refeicoes_modelo'>
export type TipoRefeicao = RefeicaoModelo['tipo']

export async function listarCardapios(busca: string, objetivo: string): Promise<CardapioLinha[]> {
  let q = supabase.from('cardapios').select('*').order('titulo')
  for (const p of palavrasBusca(busca)) q = q.like('busca', p)
  if (objetivo) q = q.eq('objetivo', objetivo)
  return ok(await q)
}

export async function buscarCardapio(id: string): Promise<CardapioLinha> {
  return ok(await supabase.from('cardapios').select('*').eq('id', id).single())
}

export async function salvarCardapio(dados: TablesInsert<'cardapios'>): Promise<CardapioLinha> {
  const { id, ...campos } = dados
  const consulta = id
    ? supabase.from('cardapios').update(campos).eq('id', id)
    : supabase.from('cardapios').insert(campos)
  return ok(await consulta.select('*').single())
}

export async function listarRefeicoes(busca: string, tipo: string): Promise<RefeicaoModelo[]> {
  let q = supabase.from('refeicoes_modelo').select('*').order('nome')
  for (const p of palavrasBusca(busca)) q = q.like('busca', p)
  if (tipo) q = q.eq('tipo', tipo as TipoRefeicao)
  return ok(await q)
}

export async function salvarRefeicao(
  dados: TablesInsert<'refeicoes_modelo'>,
): Promise<RefeicaoModelo> {
  const { id, ...campos } = dados
  const consulta = id
    ? supabase.from('refeicoes_modelo').update(campos).eq('id', id)
    : supabase.from('refeicoes_modelo').insert(campos)
  return ok(await consulta.select('*').single())
}

export async function removerRefeicao(id: string): Promise<void> {
  ok(await supabase.from('refeicoes_modelo').delete().eq('id', id))
}

/** Ingredientes por porção das receitas usadas no cardápio, para a lista de compras. */
export async function ingredientesDeReceitas(ids: string[]): Promise<IngredientesPorPorcao> {
  if (ids.length === 0) return new Map()
  const linhas = ok(
    await supabase
      .from('receitas')
      .select('id, porcoes, receita_itens(gramas, alimentos(nome, grupo))')
      .in('id', ids),
  ) as {
    id: string
    porcoes: number
    receita_itens: { gramas: number; alimentos: { nome: string; grupo: string } }[]
  }[]
  return new Map(
    linhas.map((r) => [
      r.id,
      r.receita_itens.map((i) => ({
        nome: i.alimentos.nome,
        grupo: i.alimentos.grupo,
        gramas: i.gramas / r.porcoes,
      })),
    ]),
  )
}
