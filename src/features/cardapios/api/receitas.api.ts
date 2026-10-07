import { porPorcao, type Nutrientes } from '@/domain/nutricao'
import { supabase } from '@/lib/supabase'

export type ReceitaResumo = {
  id: string
  nome: string
  foto: string | null
  tempo_minutos: number | null
  porcoes: number
  refeicoes: string[]
  objetivos: string[]
  favorita: boolean
}

export type ReceitaCompleta = ReceitaResumo & {
  ingredientes: string
  preparo: string
  porPorcao: Nutrientes | null
}

async function links(caminhos: (string | null)[]) {
  const unicos = [...new Set(caminhos.filter((c): c is string => Boolean(c)))]
  if (!unicos.length) return new Map<string, string>()
  const { data } = await supabase.storage.from('receitas').createSignedUrls(unicos, 3600)
  return new Map(
    (data ?? []).flatMap((l) => (l.path && l.signedUrl ? [[l.path, l.signedUrl] as const] : [])),
  )
}

async function favoritas(): Promise<Set<string>> {
  const { data } = await supabase.from('receitas_favoritas').select('receita_id')
  return new Set((data ?? []).map((f) => f.receita_id))
}

/** Receitas publicadas com foto (link assinado) e se é favorita dela. */
export async function listarReceitas(): Promise<ReceitaResumo[]> {
  const [r, fav] = await Promise.all([
    supabase
      .from('receitas')
      .select('id, nome, foto_path, tempo_minutos, porcoes, refeicoes, objetivos')
      .order('nome'),
    favoritas(),
  ])
  if (r.error) throw r.error
  const fotos = await links((r.data ?? []).map((x) => x.foto_path))
  return (r.data ?? []).map(({ foto_path, ...x }) => ({
    ...x,
    foto: foto_path ? (fotos.get(foto_path) ?? null) : null,
    favorita: fav.has(x.id),
  }))
}

/** Receita aberta: texto, ingredientes e informação nutricional por porção (quando calculada). */
export async function buscarReceita(id: string): Promise<ReceitaCompleta | null> {
  const [r, fav] = await Promise.all([
    supabase
      .from('receitas')
      .select(
        'id, nome, foto_path, tempo_minutos, porcoes, refeicoes, objetivos, ingredientes, preparo, calcular, receita_itens(gramas, alimentos(kcal, proteina, carboidrato, gordura, fibra))',
      )
      .eq('id', id)
      .maybeSingle(),
    favoritas(),
  ])
  if (r.error) throw r.error
  if (!r.data) return null
  const { foto_path, receita_itens, calcular, ...x } = r.data
  const fotos = await links([foto_path])
  const itens = receita_itens.map((i) => ({ por100: i.alimentos, gramas: i.gramas }))
  return {
    ...x,
    foto: foto_path ? (fotos.get(foto_path) ?? null) : null,
    favorita: fav.has(x.id),
    porPorcao: calcular && itens.length ? porPorcao(itens, x.porcoes) : null,
  }
}

export async function favoritar(id: string, favorita: boolean): Promise<void> {
  const { error } = favorita
    ? await supabase.from('receitas_favoritas').insert({ receita_id: id })
    : await supabase.from('receitas_favoritas').delete().eq('receita_id', id)
  if (error && error.code !== '23505') throw error
}
