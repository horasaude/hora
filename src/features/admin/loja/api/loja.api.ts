import { comprimirImagem } from '@/lib/imagem'
import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/database'
import { ok } from '../../api/conteudo.api'

export type Parceiro = Tables<'loja_parceiros'> & { loja_produtos?: { count: number }[] }
export type Produto = Tables<'loja_produtos'> & { loja_parceiros: { nome: string } | null }

export async function resumoLoja() {
  const l = ok(await supabase.rpc('painel_loja'))
  return (
    l[0] ?? {
      publicados: 0,
      parceiros_ativos: 0,
      cliques_mes: 0,
      mais_clicado: null,
      mais_clicado_cliques: 0,
    }
  )
}

export async function listarProdutos(): Promise<Produto[]> {
  return ok(
    await supabase
      .from('loja_produtos')
      .select('*, loja_parceiros(nome)')
      .order('destaque', { ascending: false })
      .order('nome'),
  ) as Produto[]
}

export async function listarParceiros(): Promise<Parceiro[]> {
  return ok(
    await supabase.from('loja_parceiros').select('*, loja_produtos(count)').order('nome'),
  ) as Parceiro[]
}

export async function cliquesPorSemana(produto: string) {
  return ok(await supabase.rpc('cliques_por_semana', { p_produto: produto }))
}

/** Links assinados (1 hora) das fotos e logos do espaço privado loja. */
export async function linksFotos(caminhos: string[]): Promise<Record<string, string>> {
  const unicos = [...new Set(caminhos.filter(Boolean))]
  if (unicos.length === 0) return {}
  const { data } = await supabase.storage.from('loja').createSignedUrls(unicos, 3600)
  return Object.fromEntries(
    (data ?? []).flatMap((d) => (d.path && d.signedUrl ? [[d.path, d.signedUrl]] : [])),
  )
}

/** Comprime e sobe a imagem; devolve o caminho no espaço loja. */
async function subir(pasta: string, arquivo: File): Promise<string> {
  const leve = await comprimirImagem(arquivo)
  const caminho = `${pasta}/${crypto.randomUUID()}.${leve.name.split('.').pop() ?? 'jpg'}`
  const { error } = await supabase.storage
    .from('loja')
    .upload(caminho, leve, { contentType: leve.type })
  if (error) throw error
  return caminho
}

export async function salvarProduto(d: TablesInsert<'loja_produtos'> & { arquivo?: File }) {
  const { id, arquivo, ...campos } = d
  if (arquivo) campos.foto_path = await subir('produtos', arquivo)
  const linha = { ...campos, updated_at: new Date().toISOString() }
  ok(
    await (id
      ? supabase.from('loja_produtos').update(linha).eq('id', id)
      : supabase.from('loja_produtos').insert(linha)),
  )
}

export async function salvarParceiro(d: TablesInsert<'loja_parceiros'> & { arquivo?: File }) {
  const { id, arquivo, ...campos } = d
  if (arquivo) campos.logo_path = await subir('parceiros', arquivo)
  const linha = { ...campos, updated_at: new Date().toISOString() }
  ok(
    await (id
      ? supabase.from('loja_parceiros').update(linha).eq('id', id)
      : supabase.from('loja_parceiros').insert(linha)),
  )
}
