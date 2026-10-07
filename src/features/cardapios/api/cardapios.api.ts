import { lerRefeicoes } from '@/domain/formatoCardapio'
import type { IngredientesPorPorcao } from '@/domain/listaCompras'
import type { Refeicao } from '@/domain/nutricao'
import { supabase } from '@/lib/supabase'

export type Cardapio = {
  id: string
  objetivo: string
  titulo: string
  descricao: string
  texto: boolean
  refeicoes: Refeicao[]
}

const ordenar = (r: Refeicao[]) =>
  [...r].sort((a, b) => (a.horario || '99').localeCompare(b.horario || '99'))

/** Cardápios publicados (o banco nunca entrega rascunho), com as refeições em ordem de horário. */
export async function listarCardapios(): Promise<Cardapio[]> {
  const { data, error } = await supabase
    .from('cardapios')
    .select('id, objetivo, titulo, descricao, modelo, refeicoes')
    .order('titulo')
  if (error) throw error
  return (data ?? []).map((c) => ({
    id: c.id,
    objetivo: c.objetivo,
    titulo: c.titulo,
    descricao: c.descricao,
    texto: c.modelo === 'texto',
    refeicoes: ordenar(lerRefeicoes(c.refeicoes)),
  }))
}

/** Ingredientes por porção das receitas usadas no cardápio, para a lista de compras. */
export async function ingredientesDeReceitas(ids: string[]): Promise<IngredientesPorPorcao> {
  if (ids.length === 0) return new Map()
  const { data, error } = await supabase
    .from('receitas')
    .select('id, porcoes, receita_itens(gramas, alimentos(nome, grupo))')
    .in('id', ids)
  if (error) throw error
  return new Map(
    (data ?? []).map((r) => [
      r.id,
      r.receita_itens.map((i) => ({
        nome: i.alimentos.nome,
        grupo: i.alimentos.grupo,
        gramas: i.gramas / r.porcoes,
      })),
    ]),
  )
}

/** Itens da lista de compras que ela já marcou neste cardápio. */
export async function buscarMarcados(cardapio: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('lista_compras_marcados')
    .select('item')
    .eq('cardapio_id', cardapio)
  if (error) throw error
  return (data ?? []).map((m) => m.item)
}

export async function marcarItem(cardapio: string, item: string, marcado: boolean): Promise<void> {
  const { error } = marcado
    ? await supabase.from('lista_compras_marcados').insert({ cardapio_id: cardapio, item })
    : await supabase
        .from('lista_compras_marcados')
        .delete()
        .eq('cardapio_id', cardapio)
        .eq('item', item)
  if (error && error.code !== '23505') throw error
}
