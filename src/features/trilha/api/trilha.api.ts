import { lerTrechos } from '@/domain/assistido'
import type { Trilha } from '@/domain/trilha'
import { supabase } from '@/lib/supabase'
import { esquemaTrilha } from '../schemas/trilha.schema'

/** Trilha como a aluna veria num dia escolhido (só admin; não grava nada). */
export async function buscarTrilhaPrevia(dia: number): Promise<Trilha> {
  const { data, error } = await supabase.rpc('trilha_previa', { p_dia: dia })
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

/** Só as dela: a equipe lê as conclusões de todas, e na visão de aluna contaria as das outras. */
export async function aulaConcluida(id: string): Promise<boolean> {
  const { data: sessao } = await supabase.auth.getSession()
  const { count, error } = await supabase
    .from('aulas_concluidas')
    .select('aula_id', { count: 'exact', head: true })
    .eq('aula_id', id)
    .eq('perfil_id', sessao.session?.user.id ?? '')
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

export type MaterialAula = {
  id: string
  tipo: 'pdf' | 'imagem' | 'word' | 'link'
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

export type ProgressoVideo = { trechos: [number, number][]; posicao: number; duracao: number }

/** Onde a aluna parou no vídeo e os trechos que ela já assistiu. */
export async function buscarProgresso(aula: string): Promise<ProgressoVideo | null> {
  const { data, error } = await supabase
    .from('aulas_progresso')
    .select('trechos, posicao, duracao')
    .eq('aula_id', aula)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    trechos: lerTrechos(data.trechos),
    posicao: Number(data.posicao),
    duracao: Number(data.duracao),
  }
}

export async function salvarProgresso(aula: string, p: ProgressoVideo): Promise<void> {
  const { error } = await supabase.from('aulas_progresso').upsert(
    {
      aula_id: aula,
      trechos: p.trechos.map(([a, b]) => [Math.floor(a), Math.ceil(b)]),
      posicao: Math.floor(p.posicao),
      duracao: Math.round(p.duracao),
    },
    { onConflict: 'perfil_id,aula_id' },
  )
  if (error) throw error
}
