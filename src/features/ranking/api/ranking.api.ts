import type { LinhaRanking } from '@/domain/engajamento'
import { linksDasFotos } from '@/lib/fotos'
import { supabase } from '@/lib/supabase'

export type Periodo = 'mes' | 'ano'

/** Ranking do mês ou do ano (o banco esconde quem escolheu não aparecer, menos ela mesma). */
export async function buscarRanking(periodo: Periodo): Promise<LinhaRanking[]> {
  const { data, error } = await supabase.rpc('ranking_pontos', { p_periodo: periodo })
  if (error) throw error
  return data ?? []
}

export type UltimoPonto = { acao: string; pontos: number; motivo: string | null }

/** Última ação que deu pontos à aluna. */
export async function buscarUltimoPonto(): Promise<UltimoPonto | null> {
  const { data, error } = await supabase
    .from('lancamentos_pontos')
    .select('acao, pontos, motivo')
    .gt('pontos', 0)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

export type RegraPontos = { acao: string; nome: string; pontos: number }

/** Regras de pontos ligadas, na ordem do painel (Como ganhar pontos). */
export async function buscarRegras(): Promise<RegraPontos[]> {
  const { data, error } = await supabase
    .from('regras_pontos')
    .select('acao, nome, pontos')
    .eq('ativo', true)
    .gt('pontos', 0)
    .order('ordem')
  if (error) throw error
  return data ?? []
}

/** Links das fotos de perfil (espaço avatares, que a comunidade com acesso lê). */
export async function linksDosRetratos(caminhos: (string | null | undefined)[]) {
  return linksDasFotos(
    'avatares',
    caminhos.map((c) => c ?? null),
  )
}
