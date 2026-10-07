import type { LinhaRanking } from '@/domain/engajamento'
import { subirFoto } from '@/lib/fotos'
import { supabase, semValor } from '@/lib/supabase'

export type Desafio = {
  id: string
  nome: string
  descricao: string
  inicio: string
  fim: string
  tipo_checkin: 'sim_nao' | 'foto' | 'numero'
  unidade: string | null
  meta_diaria: number | null
  meta_dias: number
  pontos_por_dia: number
  bonus_conclusao: number
  premio: string
  premio_surpresa: boolean
  encerrado: boolean
  participando: boolean
  participantes: number
  dias_feitos: number
  feito_hoje: boolean
}

/** Desafios publicados com a situação dela (participando, dias feitos, feito hoje). */
export async function buscarDesafios(): Promise<Desafio[]> {
  const { data, error } = await supabase.rpc('meus_desafios')
  if (error) throw error
  return (data ?? []) as Desafio[]
}

export type DiaDesafio = { dia: string; valor: number | null }

/** Dias que ela marcou neste desafio. */
export async function buscarMeusDias(desafio: string): Promise<DiaDesafio[]> {
  const { data, error } = await supabase
    .from('desafio_checkins')
    .select('dia, valor')
    .eq('desafio_id', desafio)
    .order('dia')
  if (error) throw error
  return data ?? []
}

/** Ranking do desafio por apelido (posição, apelido, dias cumpridos). */
export async function buscarRankingDesafio(
  desafio: string,
): Promise<(Omit<LinhaRanking, 'pontos'> & { dias: number })[]> {
  const { data, error } = await supabase.rpc('ranking_desafio', { p_desafio: desafio })
  if (error) throw error
  return data ?? []
}

export async function entrarDesafio(desafio: string): Promise<void> {
  const { error } = await supabase.rpc('entrar_desafio', { p_desafio: desafio })
  if (error) throw error
}

export type CheckinDesafio = { desafio: string; valor?: number; arquivo?: File }

/** Check-in do dia no desafio; devolve os pontos ganhos (dia e bônus). */
export async function fazerCheckinDesafio(d: CheckinDesafio): Promise<number> {
  const foto = d.arquivo ? await subirFoto('checkins', 'desafio', d.arquivo) : undefined
  const { data, error } = await supabase.rpc('checkin_desafio', {
    p_desafio: d.desafio,
    p_valor: d.valor ?? (semValor as unknown as number),
    p_foto_path: foto ?? semValor,
  })
  if (error) throw error
  return data ?? 0
}
