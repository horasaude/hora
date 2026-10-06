import { supabase } from '@/lib/supabase'
import type { AulaTrilha } from '@/domain/trilha'

export type Trilha = { aulas: AulaTrilha[]; dia: number | null }

export type AulaAberta = {
  id: string
  titulo: string
  descricao: string
  video_url: string
  material_url: string | null
  profissional: string | null
  duracao_minutos: number | null
}

/** Trilha da aluna (fechadas vêm sem vídeo) e o dia do acesso; dia null = sem acesso ativo. */
export async function buscarTrilha(): Promise<Trilha> {
  const [trilha, dia] = await Promise.all([
    supabase.rpc('minha_trilha'),
    supabase.rpc('dia_de_acesso'),
  ])
  if (trilha.error) throw trilha.error
  if (dia.error) throw dia.error
  return { aulas: trilha.data ?? [], dia: dia.data ?? null }
}

/** Aula liberada para a aluna; null quando ainda não abriu (o banco não entrega). */
export async function buscarAula(id: string): Promise<AulaAberta | null> {
  const { data, error } = await supabase
    .from('aulas')
    .select('id, titulo, descricao, video_url, material_url, profissional, duracao_minutos')
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

/** Marca ou desmarca a aula como concluída pela aluna logada. */
export async function marcarConcluida(id: string, concluida: boolean): Promise<void> {
  const { error } = concluida
    ? await supabase.from('aulas_concluidas').insert({ aula_id: id })
    : await supabase.from('aulas_concluidas').delete().eq('aula_id', id)
  if (error && error.code !== '23505') throw error
}
