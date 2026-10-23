// Arquivos das aulas e do Comece por aqui (bucket privado materiais; a aluna recebe link assinado).
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'
import { ok } from './conteudo.api'

export type MaterialSalvo = Tables<'aula_materiais'>

export async function buscarMateriais(aula: string): Promise<MaterialSalvo[]> {
  return ok(await supabase.from('aula_materiais').select('*').eq('aula_id', aula).order('ordem'))
}

export type MaterialParaSalvar = {
  tipo: string
  caminho: string
  nome: string
  tamanho: number | null
}

/** Grava a lista de materiais da aula na ordem dada e apaga do espaço os arquivos tirados. */
export async function salvarMateriais(
  aula: string,
  itens: MaterialParaSalvar[],
  removidos: string[],
) {
  const { error } = await supabase.rpc('salvar_materiais', { p_aula: aula, p_itens: itens })
  if (error) throw error
  if (removidos.length) await supabase.storage.from('materiais').remove(removidos)
}

export type MaterialComece = Tables<'comece_materiais'>

export async function buscarMateriaisComece(): Promise<MaterialComece[]> {
  return ok(await supabase.from('comece_materiais').select('*').order('ordem'))
}

/** Grava os arquivos do Comece por aqui na ordem dada e apaga do espaço os tirados. */
export async function salvarMateriaisComece(itens: MaterialParaSalvar[], removidos: string[]) {
  const { error } = await supabase.rpc('salvar_materiais_comece', { p_itens: itens })
  if (error) throw error
  if (removidos.length) await supabase.storage.from('materiais').remove(removidos)
}

export async function buscarMateriaisTema(tema: string): Promise<MaterialSalvo[]> {
  const linhas = ok(
    await supabase.from('tema_materiais').select('*').eq('tema_id', tema).order('ordem'),
  )
  return linhas.map((m) => ({ ...m, aula_id: tema }))
}

/** Grava os arquivos do tema na ordem dada e apaga do espaço os tirados. */
export async function salvarMateriaisTema(
  tema: string,
  itens: MaterialParaSalvar[],
  removidos: string[],
) {
  const { error } = await supabase.rpc('salvar_materiais_tema', { p_tema: tema, p_itens: itens })
  if (error) throw error
  if (removidos.length) await supabase.storage.from('materiais').remove(removidos)
}

export async function buscarMateriaisApoio(material: string): Promise<MaterialSalvo[]> {
  const linhas = ok(
    await supabase.from('material_arquivos').select('*').eq('material_id', material).order('ordem'),
  )
  return linhas.map((m) => ({ ...m, aula_id: material }))
}

/** Grava os anexos do material da nutricionista ou da Dra. Clara e apaga do espaço os tirados. */
export async function salvarMateriaisApoio(
  material: string,
  itens: MaterialParaSalvar[],
  removidos: string[],
) {
  const { error } = await supabase.rpc('salvar_materiais_apoio', {
    p_material: material,
    p_itens: itens,
  })
  if (error) throw error
  if (removidos.length) await supabase.storage.from('materiais').remove(removidos)
}
