// Materiais do plano alimentar (textos de apoio, como no Dietbox): lista, salvar e excluir.
import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/database'
import { ok } from '../../api/conteudo.api'

export type MaterialNutricao = Tables<'materiais_nutricao'>

export async function listarMateriaisNutricao(): Promise<MaterialNutricao[]> {
  return ok(
    await supabase.from('materiais_nutricao').select('*').order('ordem').order('created_at'),
  )
}

/** Material novo entra no fim da lista. */
export async function salvarMaterialNutricao(
  d: TablesInsert<'materiais_nutricao'>,
): Promise<MaterialNutricao> {
  const { id, ...campos } = d
  const consulta = id
    ? supabase.from('materiais_nutricao').update(campos).eq('id', id)
    : supabase.from('materiais_nutricao').insert({ ordem: 9999, ...campos })
  return ok(await consulta.select('*').single())
}

export async function excluirMaterialNutricao(id: string) {
  ok(await supabase.from('materiais_nutricao').delete().eq('id', id))
}
