import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

type ParceiroVitrine = Pick<Tables<'loja_parceiros'>, 'id' | 'nome' | 'logo_path' | 'cupom'>
export type ProdutoVitrine = Omit<
  Tables<'loja_produtos'>,
  'created_at' | 'updated_at' | 'publicado'
> & {
  loja_parceiros: ParceiroVitrine | null
  foto?: string
  logo?: string
}

const CAMPOS =
  'id, parceiro_id, nome, descricao, categoria, foto_path, preco_centavos, preco_final_centavos, cupom, link_url, destaque, loja_parceiros(id, nome, logo_path, cupom)'

/** Produtos da vitrine (o banco só entrega publicados de parceiro ativo) com links assinados das fotos. */
export async function listarVitrine(): Promise<ProdutoVitrine[]> {
  const { data, error } = await supabase.from('loja_produtos').select(CAMPOS)
  if (error) throw error
  const linhas = (data ?? []) as ProdutoVitrine[]
  const caminhos = [
    ...new Set(
      linhas
        .flatMap((p) => [p.foto_path, p.loja_parceiros?.logo_path])
        .filter((c): c is string => Boolean(c)),
    ),
  ]
  if (caminhos.length === 0) return linhas
  const { data: links } = await supabase.storage.from('loja').createSignedUrls(caminhos, 3600)
  const mapa = new Map((links ?? []).map((l) => [l.path, l.signedUrl ?? undefined]))
  return linhas.map((p) => ({
    ...p,
    foto: p.foto_path ? mapa.get(p.foto_path) : undefined,
    logo: p.loja_parceiros?.logo_path ? mapa.get(p.loja_parceiros.logo_path) : undefined,
  }))
}

/** Registra o clique em Comprar; falha não atrapalha a compra. */
export async function registrarClique(produto: string) {
  await supabase.rpc('registrar_clique_loja', { p_produto: produto })
}
