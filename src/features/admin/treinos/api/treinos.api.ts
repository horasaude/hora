import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/database'
import { ok } from '../../api/conteudo.api'

export type Exercicio = Tables<'exercicios'>
export type Treino = Tables<'treinos'>
export type ItemTreino = Omit<Tables<'treino_exercicios'>, 'id' | 'treino_id' | 'ordem'> & {
  chave: string
  nome: string
  alternativo_nome: string
}
export type TreinoLista = Treino & { qtd: number }
export type DiaRotina = { dia_semana: number | null; ordem: number | null; treino_id: string }
export type Rotina = Tables<'rotinas'> & { dias: DiaRotina[] }

export async function listarExercicios(
  busca: string,
  grupo: string,
  equipamento: string,
): Promise<Exercicio[]> {
  let q = supabase.from('exercicios').select('*').order('nome')
  if (busca.trim()) q = q.ilike('nome', `%${busca.trim()}%`)
  if (grupo) q = q.eq('grupo', grupo)
  if (equipamento) q = q.eq('equipamento', equipamento)
  return ok(await q)
}

export async function salvarExercicio(d: TablesInsert<'exercicios'>): Promise<Exercicio> {
  const { id, ...campos } = d
  const q = id
    ? supabase.from('exercicios').update(campos).eq('id', id)
    : supabase.from('exercicios').insert(campos)
  return ok(await q.select('*').single())
}

/** Ids dos exercícios favoritos de quem está no painel. */
export async function listarFavoritos(): Promise<string[]> {
  const linhas = ok(await supabase.from('exercicios_favoritos').select('exercicio_id'))
  return linhas.map((f) => f.exercicio_id)
}

export async function marcarFavorito(d: { id: string; favorito: boolean }): Promise<void> {
  ok(
    d.favorito
      ? await supabase.from('exercicios_favoritos').insert({ exercicio_id: d.id })
      : await supabase.from('exercicios_favoritos').delete().eq('exercicio_id', d.id),
  )
}

export async function removerExercicio(id: string): Promise<void> {
  ok(await supabase.from('exercicios').delete().eq('id', id))
}

export async function listarTreinos(): Promise<TreinoLista[]> {
  const linhas = ok(
    await supabase.from('treinos').select('*, treino_exercicios(count)').order('nome'),
  ) as (Treino & { treino_exercicios: { count: number }[] })[]
  return linhas.map(({ treino_exercicios, ...t }) => ({
    ...t,
    qtd: treino_exercicios[0]?.count ?? 0,
  }))
}

/** Treino com os exercícios na ordem, cada um com o nome da biblioteca. */
export async function buscarTreino(id: string): Promise<{ treino: Treino; itens: ItemTreino[] }> {
  const treino: Treino = ok(await supabase.from('treinos').select('*').eq('id', id).single())
  const itens = ok(
    await supabase
      .from('treino_exercicios')
      .select(
        'exercicio_id, series, repeticoes, carga, descanso_segundos, observacao, series_detalhe, alternativo_id, combinado, exercicios!exercicio_id(nome), alternativo:exercicios!alternativo_id(nome)',
      )
      .eq('treino_id', id)
      .order('ordem'),
  ) as (Omit<ItemTreino, 'chave' | 'nome' | 'alternativo_nome'> & {
    exercicios: { nome: string } | null
    alternativo: { nome: string } | null
  })[]
  return {
    treino,
    itens: itens.map(({ exercicios, alternativo, ...i }) => ({
      ...i,
      chave: crypto.randomUUID(),
      nome: exercicios?.nome ?? '',
      alternativo_nome: alternativo?.nome ?? '',
    })),
  }
}

export type DadosTreino = Omit<TablesInsert<'treinos'>, 'created_at' | 'updated_at'>

export async function salvarTreino(d: {
  treino: DadosTreino
  itens: ItemTreino[]
}): Promise<string> {
  const itens = d.itens.map(({ chave: _c, nome: _n, alternativo_nome: _a, ...i }) => i)
  return ok(await supabase.rpc('salvar_treino', { p_treino: d.treino, p_itens: itens }))
}

export async function removerTreino(id: string): Promise<void> {
  ok(await supabase.from('treinos').delete().eq('id', id))
}

export async function listarRotinas(): Promise<Rotina[]> {
  const linhas = ok(
    await supabase
      .from('rotinas')
      .select('*, rotina_treinos(dia_semana, ordem, treino_id)')
      .order('nome'),
  ) as (Tables<'rotinas'> & { rotina_treinos: Rotina['dias'] })[]
  return linhas.map(({ rotina_treinos, ...r }) => ({ ...r, dias: rotina_treinos }))
}

export async function salvarRotina(d: {
  rotina: Omit<TablesInsert<'rotinas'>, 'created_at' | 'updated_at'>
  dias: Rotina['dias']
}): Promise<string> {
  return ok(await supabase.rpc('salvar_rotina', { p_rotina: d.rotina, p_dias: d.dias }))
}

export async function removerRotina(id: string): Promise<void> {
  ok(await supabase.from('rotinas').delete().eq('id', id))
}

export async function publicar(d: {
  tabela: 'treinos' | 'rotinas'
  id: string
  publicado: boolean
}) {
  ok(await supabase.from(d.tabela).update({ publicado: d.publicado }).eq('id', d.id))
}

export type ResumoTreinos = { publicados: number; exercicios: number; feitos_7_dias: number }

export async function resumoTreinos(): Promise<ResumoTreinos> {
  return ok(await supabase.rpc('resumo_treinos')) as ResumoTreinos
}
