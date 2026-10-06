import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/database'

export type Tema = Tables<'temas'>
export type Etapa = Tables<'etapas'>
export type Aula = Tables<'aulas'>
export type TabelaConteudo =
  'temas' | 'etapas' | 'aulas' | 'lives' | 'avisos' | 'cardapios' | 'desafios'

/** Resposta do Supabase: devolve os dados ou lança o erro. */
export function ok<D>({ data, error }: { data: D | null; error: unknown }): D {
  if (error) throw error
  return data as D
}

export async function listarTemas(): Promise<Tema[]> {
  return ok(await supabase.from('temas').select('*').order('ordem').order('created_at'))
}

export async function buscarTema(
  id: string,
): Promise<{ tema: Tema; etapas: Etapa[]; aulas: Aula[] }> {
  const tema: Tema = ok(await supabase.from('temas').select('*').eq('id', id).single())
  const etapas: Etapa[] = ok(
    await supabase.from('etapas').select('*').eq('tema_id', id).order('ordem'),
  )
  const ids = etapas.map((e) => e.id)
  const aulas: Aula[] = ids.length
    ? ok(
        await supabase
          .from('aulas')
          .select('*')
          .in('etapa_id', ids)
          .order('ordem')
          .order('created_at'),
      )
    : []
  return { tema, etapas, aulas }
}

export async function buscarAula(id: string): Promise<Aula> {
  return ok(await supabase.from('aulas').select('*').eq('id', id).single())
}

export async function salvarTema(dados: TablesInsert<'temas'>): Promise<Tema> {
  const { id, ...campos } = dados
  const consulta = id
    ? supabase.from('temas').update(campos).eq('id', id)
    : supabase.from('temas').insert({ ...campos, ordem: 9999 })
  return ok(await consulta.select('*').single())
}

/** Etapa nova entra no fim do tema. */
export async function salvarEtapa(dados: TablesInsert<'etapas'>): Promise<Etapa> {
  const { id, ...campos } = dados
  if (id) return ok(await supabase.from('etapas').update(campos).eq('id', id).select('*').single())
  const ultima = ok(
    await supabase
      .from('etapas')
      .select('ordem')
      .eq('tema_id', campos.tema_id)
      .order('ordem', { ascending: false })
      .limit(1),
  )
  const ordem = (ultima[0]?.ordem ?? 0) + 1
  return ok(
    await supabase
      .from('etapas')
      .insert({ ...campos, ordem })
      .select('*')
      .single(),
  )
}

export async function salvarAula(dados: TablesInsert<'aulas'>): Promise<Aula> {
  const { id, ...campos } = dados
  const consulta = id
    ? supabase.from('aulas').update(campos).eq('id', id)
    : supabase.from('aulas').insert({ ...campos, ordem: 9999 })
  return ok(await consulta.select('*').single())
}

export async function alternarPublicado(tabela: TabelaConteudo, id: string, publicado: boolean) {
  const { error } = await supabase.from(tabela).update({ publicado }).eq('id', id)
  if (error) throw error
}

export async function mover(tipo: 'tema' | 'etapa' | 'aula', id: string, direcao: 1 | -1) {
  const nome = `mover_${tipo}` as const
  const { error } = await supabase.rpc(nome, { p_id: id, p_direcao: direcao })
  if (error) throw error
}

/** Só a situação de cada aula, para os números do resumo. */
export async function listarSituacaoAulas(): Promise<{ publicado: boolean }[]> {
  return ok(await supabase.from('aulas').select('publicado'))
}
