import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

export type ExercicioDoTreino = Omit<Tables<'treino_exercicios'>, 'id' | 'treino_id'> & {
  exercicio: Tables<'exercicios'>
}
export type TreinoResumo = Tables<'treinos'> & { qtd: number }
export type TreinoCompleto = Tables<'treinos'> & { itens: ExercicioDoTreino[] }
export type DiaRotina = { dia_semana: number; treino: TreinoResumo }
export type RotinaAluna = Tables<'rotinas'> & { dias: DiaRotina[] }

/** Na pré-visualização do painel (admin lê tudo), filtra como a aluna veria: publicado e do tema. */
export type Filtro = { tema: string | null }

type ComContagem = Tables<'treinos'> & { treino_exercicios: { count: number }[] }
const resumo = ({ treino_exercicios, ...t }: ComContagem): TreinoResumo => ({
  ...t,
  qtd: treino_exercicios[0]?.count ?? 0,
})

export async function listarTreinos(
  nivel: string,
  local: string,
  f: Filtro | null,
): Promise<TreinoResumo[]> {
  let q = supabase
    .from('treinos')
    .select('*, treino_exercicios(count)')
    .eq('nivel', nivel)
    .eq('local', local)
  if (f) q = q.eq('publicado', true).eq('tema_id', f.tema ?? '')
  const { data, error } = await q.order('nome')
  if (error) throw error
  return (data as ComContagem[]).map(resumo)
}

/** Rotina do tema e do nível; com o local dela quando existir. */
export async function buscarRotina(
  nivel: string,
  local: string,
  f: Filtro | null,
): Promise<RotinaAluna | null> {
  let q = supabase
    .from('rotinas')
    .select('*, rotina_treinos(dia_semana, treinos(*, treino_exercicios(count)))')
    .eq('nivel', nivel)
  if (f) q = q.eq('publicado', true).eq('tema_id', f.tema ?? '')
  const { data, error } = await q
  if (error) throw error
  type Linha = Tables<'rotinas'> & {
    rotina_treinos: { dia_semana: number; treinos: ComContagem | null }[]
  }
  const linhas = data as Linha[]
  const r = linhas.find((x) => x.local === local) ?? linhas[0]
  if (!r) return null
  const { rotina_treinos, ...rotina } = r
  const dias = rotina_treinos.flatMap((d) =>
    d.treinos ? [{ dia_semana: d.dia_semana, treino: resumo(d.treinos) }] : [],
  )
  return { ...rotina, dias }
}

export async function buscarTreino(id: string): Promise<TreinoCompleto | null> {
  const { data, error } = await supabase
    .from('treinos')
    .select(
      '*, treino_exercicios(exercicio_id, ordem, series, repeticoes, carga, descanso_segundos, observacao, exercicio:exercicios!exercicio_id(*))',
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
