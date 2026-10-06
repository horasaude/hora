import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/database'
import { ok } from './conteudo.api'

export type Live = Tables<'lives'>
export type Aviso = Tables<'avisos'>

export async function listarLives(): Promise<Live[]> {
  return ok(await supabase.from('lives').select('*').order('data', { ascending: false }))
}

export async function buscarLive(id: string): Promise<Live> {
  return ok(await supabase.from('lives').select('*').eq('id', id).single())
}

export async function salvarLive(dados: TablesInsert<'lives'>): Promise<Live> {
  const { id, ...campos } = dados
  const consulta = id
    ? supabase.from('lives').update(campos).eq('id', id)
    : supabase.from('lives').insert(campos)
  return ok(await consulta.select('*').single())
}

export async function listarAvisos(): Promise<Aviso[]> {
  return ok(await supabase.from('avisos').select('*').order('publicar_em', { ascending: false }))
}

export async function buscarAviso(id: string): Promise<Aviso> {
  return ok(await supabase.from('avisos').select('*').eq('id', id).single())
}

export async function salvarAviso(dados: TablesInsert<'avisos'>): Promise<Aviso> {
  const { id, ...campos } = dados
  const consulta = id
    ? supabase.from('avisos').update(campos).eq('id', id)
    : supabase.from('avisos').insert(campos)
  return ok(await consulta.select('*').single())
}
