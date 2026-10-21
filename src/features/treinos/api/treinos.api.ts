import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

export type ExercicioDoTreino = Omit<Tables<'treino_exercicios'>, 'id' | 'treino_id'> & {
  exercicio: Tables<'exercicios'>
  alternativo: Tables<'exercicios'> | null
}
export type TreinoResumo = Tables<'treinos'> & { qtd: number }
export type TreinoCompleto = Tables<'treinos'> & { itens: ExercicioDoTreino[] }
export type DiaRotina = { dia_semana: number | null; ordem: number | null; treino: TreinoResumo }
export type RotinaAluna = Tables<'rotinas'> & { dias: DiaRotina[] }

/** Na pré-visualização do painel (admin lê tudo), filtra como a aluna veria: publicado e do tema. */
export type Filtro = { tema: string | null }

export async function buscarTreino(id: string): Promise<TreinoCompleto | null> {
  const { data, error } = await supabase
    .from('treinos')
    .select(
      '*, treino_exercicios(exercicio_id, ordem, series, repeticoes, carga, descanso_segundos, observacao, series_detalhe, alternativo_id, combinado, exercicio:exercicios!exercicio_id(*), alternativo:exercicios!alternativo_id(*))',
    )
    .eq('id', id)
    .order('ordem', { referencedTable: 'treino_exercicios' })
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const { treino_exercicios, ...t } = data as unknown as Tables<'treinos'> & {
    treino_exercicios: ExercicioDoTreino[]
  }
  return { ...t, itens: treino_exercicios }
}

export type Feito = { treino_id: string; data: string }

/** Treinos concluídos de uma data em diante (aaaa-mm-dd). */
export async function listarFeitos(desde: string): Promise<Feito[]> {
  const { data, error } = await supabase
    .from('treinos_feitos')
    .select('treino_id, data')
    .gte('data', desde)
    .not('concluido_em', 'is', null)
  if (error) throw error
  return data
}

export async function registrarFeito(
  treino: string,
  series: Record<string, number>,
): Promise<void> {
  const { error } = await supabase
    .from('treinos_feitos')
    .upsert(
      { treino_id: treino, series, concluido_em: new Date().toISOString() },
      { onConflict: 'perfil_id,treino_id,data' },
    )
  if (error) throw error
}

export async function salvarPreferencias(d: {
  treino_nivel: string
  treino_local: string
}): Promise<void> {
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) throw new Error('sem sessão')
  const { error } = await supabase.from('perfis').update(d).eq('id', u.user.id)
  if (error) throw error
}

export async function buscarPreferencias(): Promise<{
  treino_nivel: string | null
  treino_local: string | null
}> {
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) return { treino_nivel: null, treino_local: null }
  const { data, error } = await supabase
    .from('perfis')
    .select('treino_nivel, treino_local')
    .eq('id', u.user.id)
    .single()
  if (error) throw error
  return data
}

/** Tema da Preparação (a pré-visualização sem tema mostra os treinos dela). */
export async function temaPreparacao(): Promise<string | null> {
  const { data } = await supabase
    .from('temas')
    .select('id')
    .eq('tipo', 'preparacao')
    .limit(1)
    .maybeSingle()
  return data?.id ?? null
}

/** Link temporário da foto do exercício (espaço privado treinos). */
export async function linkDaFoto(caminho: string): Promise<string | null> {
  const { data } = await supabase.storage.from('treinos').createSignedUrl(caminho, 3600)
  return data?.signedUrl ?? null
}
