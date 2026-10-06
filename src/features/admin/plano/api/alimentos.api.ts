import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'
import { ok } from '../../api/conteudo.api'

export type Alimento = Tables<'alimentos'>
export type Medida = Tables<'medidas_caseiras'>
export type AlimentoComMedidas = Alimento & { medidas_caseiras: Medida[] }
export type Origem = 'taco' | 'proprio'

/** Mesma regra da coluna busca do banco: minúsculas e sem acento. */
export const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

/** Cada palavra digitada vira um trecho de LIKE (todas precisam aparecer, em qualquer ordem). */
export const palavrasBusca = (busca: string) =>
  normalizar(busca)
    .replace(/[%_\\,]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => `%${p}%`)

type Filtro = { origem: Origem; busca: string; pagina: number; tamanho: number }

export async function listarAlimentos(f: Filtro): Promise<{ lista: Alimento[]; total: number }> {
  let q = supabase
    .from('alimentos')
    .select('*', { count: 'exact' })
    .eq('origem', f.origem)
    .order('nome')
    .range((f.pagina - 1) * f.tamanho, f.pagina * f.tamanho - 1)
  for (const p of palavrasBusca(f.busca)) q = q.like('busca', p)
  const { data, error, count } = await q
  if (error) throw error
  return { lista: data ?? [], total: count ?? 0 }
}

export async function contarAlimentos(): Promise<{
  meus: number
  taco: number
  comMedida: number
}> {
  const conta = (origem: Origem) =>
    supabase.from('alimentos').select('id', { count: 'exact', head: true }).eq('origem', origem)
  const [meus, taco, medidas] = await Promise.all([
    conta('proprio'),
    conta('taco'),
    supabase.from('medidas_caseiras').select('alimento_id'),
  ])
  if (meus.error || taco.error || medidas.error) throw meus.error ?? taco.error ?? medidas.error
  return {
    meus: meus.count ?? 0,
    taco: taco.count ?? 0,
    comMedida: new Set((medidas.data ?? []).map((m) => m.alimento_id)).size,
  }
}

export async function buscarAlimento(id: string): Promise<AlimentoComMedidas> {
  return ok(
    await supabase
      .from('alimentos')
      .select('*, medidas_caseiras(*)')
      .eq('id', id)
      .order('ordem', { referencedTable: 'medidas_caseiras' })
      .single(),
  )
}

export type DadosAlimento = {
  id?: string
  nome: string
  grupo: string
  kcal: number | null
  proteina: number | null
  carboidrato: number | null
  gordura: number | null
  fibra: number | null
}

export async function salvarAlimento(
  a: DadosAlimento,
  medidas: { nome: string; gramas: number }[],
) {
  return ok(await supabase.rpc('salvar_alimento', { p_alimento: a, p_medidas: medidas }))
}

export async function duplicarAlimento(id: string) {
  return ok(await supabase.rpc('duplicar_alimento', { p_id: id }))
}

/** Erro de alimento usado numa receita (o banco bloqueia a remoção). */
export class EmUso extends Error {}

export async function removerAlimento(id: string): Promise<void> {
  const { error } = await supabase.from('alimentos').delete().eq('id', id)
  if (error && (error.code === '23001' || error.code === '23503')) throw new EmUso()
  if (error) throw error
}

/** Para escolher numa refeição ou receita: até 30 alimentos com as medidas caseiras. */
export async function buscarAlimentosParaEscolha(
  busca: string,
  origem?: Origem,
): Promise<AlimentoComMedidas[]> {
  let q = supabase.from('alimentos').select('*, medidas_caseiras(*)').order('nome').limit(30)
  if (origem) q = q.eq('origem', origem)
  for (const p of palavrasBusca(busca)) q = q.like('busca', p)
  return ok(await q)
}
