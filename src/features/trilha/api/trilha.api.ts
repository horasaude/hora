import type { Trilha } from '@/domain/trilha'
import { semValor, supabase } from '@/lib/supabase'
import { esquemaTrilha } from '../schemas/trilha.schema'

/** Trilha como a aluna veria num dia e tema escolhidos (só admin; não grava nada). */
export async function buscarTrilhaPrevia(dia: number, tema: string | null): Promise<Trilha> {
  const { data, error } = await supabase.rpc('trilha_previa', {
    p_dia: dia,
    p_tema: tema ?? semValor,
  })
  if (error) throw error
  return esquemaTrilha.parse(data)
}

export type AulaAberta = {
  id: string
  titulo: string
  descricao: string
  video_url: string
  profissional: string | null
  duracao_minutos: number | null
}

/** Trilha da aluna (o banco abre as etapas que cumpriram as metas e nunca manda vídeo de aula fechada). */
export async function buscarTrilha(): Promise<Trilha> {
  const { data, error } = await supabase.rpc('trilha_aluna')
  if (error) throw error
  return esquemaTrilha.parse(data)
}

/** Aula liberada para a aluna; null quando ainda não abriu (o banco não entrega). */
export async function buscarAula(id: string): Promise<AulaAberta | null> {
  const { data, error } = await supabase
    .from('aulas')
    .select('id, titulo, descricao, video_url, profissional, duracao_minutos')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function aulaConcluida(id: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('aulas_concluidas')
    .select('aula_id', { count: 'exact', head: true })
    .eq('aula_id', id)
  if (error) throw error
  return (count ?? 0) > 0
}

/** Marca ou desmarca a aula como concluída (os 10 pontos saem uma vez só, pelo banco). */
export async function marcarConcluida(id: string, concluida: boolean): Promise<void> {
  const { error } = concluida
    ? await supabase.from('aulas_concluidas').insert({ aula_id: id })
    : await supabase.from('aulas_concluidas').delete().eq('aula_id', id)
  if (error && error.code !== '23505') throw error
}

export async function escolherTema(tema: string): Promise<void> {
  const { error } = await supabase.rpc('escolher_tema', { p_tema: tema })
  if (error) throw error
}

export type MaterialAula = {
  id: string
  tipo: 'pdf' | 'imagem' | 'link'
  nome: string
  tamanho: number | null
  url: string | null
  baixar: string | null
}

/** Materiais da aula com links assinados de curta duração (o servidor só entrega se a aula está liberada). */
export async function buscarMateriaisAula(aula: string): Promise<MaterialAula[]> {
  const { data, error } = await supabase.functions.invoke<{ materiais?: MaterialAula[] }>(
    'materiais-aula',
    {
      body: { aula_id: aula },
    },
  )
  if (error) throw error
  return data?.materiais ?? []
}
