import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/database'
import { ok } from '../../api/conteudo.api'
import { palavrasBusca } from './alimentos.api'

const POR100 = 'kcal, proteina, carboidrato, gordura, fibra'
export type Receita = Tables<'receitas'>
export type IngredienteReceita = {
  id: string
  alimento_id: string
  gramas: number
  ordem: number
  alimentos: {
    nome: string
    grupo: string
    kcal: number | null
    proteina: number | null
    carboidrato: number | null
    gordura: number | null
    fibra: number | null
  }
}
export type ReceitaCompleta = Receita & { receita_itens: IngredienteReceita[] }

const COMPLETA = `*, receita_itens(id, alimento_id, gramas, ordem, alimentos(nome, grupo, ${POR100}))`

export async function listarReceitas(busca: string, tag: string): Promise<ReceitaCompleta[]> {
  let q = supabase.from('receitas').select(COMPLETA).order('nome')
  for (const p of palavrasBusca(busca)) q = q.like('busca', p)
  if (tag) q = q.contains('tags', [tag])
  return ok(await q) as ReceitaCompleta[]
}

export async function listarTags(): Promise<string[]> {
  const linhas = ok(await supabase.from('receitas').select('tags'))
  return [...new Set(linhas.flatMap((l) => l.tags))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export async function buscarReceita(id: string): Promise<ReceitaCompleta> {
  const r = ok(
    await supabase.from('receitas').select(COMPLETA).eq('id', id).single(),
  ) as ReceitaCompleta
  return { ...r, receita_itens: [...r.receita_itens].sort((a, b) => a.ordem - b.ordem) }
}

export async function salvarReceita(
  dados: TablesInsert<'receitas'>,
  itens: { alimento_id: string; gramas: number }[],
): Promise<string> {
  const { id, ...campos } = dados
  const consulta = id
    ? supabase.from('receitas').update(campos).eq('id', id)
    : supabase.from('receitas').insert(campos)
  const salva: { id: string } = ok(await consulta.select('id').single())
  ok(await supabase.rpc('salvar_receita_itens', { p_receita: salva.id, p_itens: itens }))
  return salva.id
}

export async function removerReceita(r: Receita): Promise<void> {
  ok(await supabase.from('receitas').delete().eq('id', r.id))
  if (r.foto_path) await supabase.storage.from('receitas').remove([r.foto_path])
}

export async function enviarFoto(arquivo: File): Promise<string> {
  const ext = (arquivo.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const caminho = `${crypto.randomUUID()}.${ext || 'jpg'}`
  const { error } = await supabase.storage
    .from('receitas')
    .upload(caminho, arquivo, { contentType: arquivo.type })
  if (error) throw error
  return caminho
}

/** Link assinado (1 hora) da foto, já que o espaço das fotos é privado. */
export async function linkFoto(caminho: string): Promise<string> {
  const { data, error } = await supabase.storage.from('receitas').createSignedUrl(caminho, 3600)
  if (error) throw error
  return data.signedUrl
}

export async function duplicarReceita(r: ReceitaCompleta, nome: string): Promise<string> {
  let foto: string | null = null
  if (r.foto_path) {
    foto = `${crypto.randomUUID()}.${r.foto_path.split('.').pop() ?? 'jpg'}`
    const { error } = await supabase.storage.from('receitas').copy(r.foto_path, foto)
    if (error) foto = null
  }
  return salvarReceita(
    {
      nome,
      foto_path: foto,
      ingredientes: r.ingredientes,
      preparo: r.preparo,
      porcoes: r.porcoes,
      tags: r.tags,
      tempo_minutos: r.tempo_minutos,
      refeicoes: r.refeicoes,
      objetivos: r.objetivos,
      calcular: r.calcular,
      publicado: false,
    },
    r.receita_itens.map((i) => ({ alimento_id: i.alimento_id, gramas: i.gramas })),
  )
}
