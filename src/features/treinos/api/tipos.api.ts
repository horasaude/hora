import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'
import type { Filtro, RotinaAluna, TreinoResumo } from './treinos.api'

type ComContagem = Tables<'treinos'> & { treino_exercicios: { count: number }[] }
const resumo = ({ treino_exercicios, ...t }: ComContagem): TreinoResumo => ({
  ...t,
  qtd: treino_exercicios[0]?.count ?? 0,
})

type Linha = Tables<'rotinas'> & {
  rotina_treinos: { dia_semana: number | null; ordem: number | null; treinos: ComContagem | null }[]
}

const paraRotina = ({ rotina_treinos, ...rotina }: Linha): RotinaAluna => ({
  ...rotina,
  dias: rotina_treinos
    .flatMap((d) =>
      d.treinos ? [{ dia_semana: d.dia_semana, ordem: d.ordem, treino: resumo(d.treinos) }] : [],
    )
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)),
})

/** Tipos de treino (rotinas) que ela pode ver; com filtro, só os publicados daquele tema. */
export async function listarTiposDeTreino(f: Filtro | null): Promise<RotinaAluna[]> {
  let q = supabase
    .from('rotinas')
    .select('*, rotina_treinos(dia_semana, ordem, treinos(*, treino_exercicios(count)))')
  if (f) q = q.eq('publicado', true).eq('tema_id', f.tema ?? '')
  const { data, error } = await q.order('nome')
  if (error) throw error
  return (data as Linha[]).map(paraRotina)
}

/** Treinos que ela pode ver (com filtro, os publicados do tema), para os que ficam fora dos tipos. */
export async function listarTreinosVisiveis(f: Filtro | null): Promise<TreinoResumo[]> {
  let q = supabase.from('treinos').select('*, treino_exercicios(count)')
  if (f) q = q.eq('publicado', true).eq('tema_id', f.tema ?? '')
  const { data, error } = await q.order('nome')
  if (error) throw error
  return (data as ComContagem[]).map(resumo)
}
