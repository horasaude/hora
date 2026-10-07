// Valores, validação e cálculo dos formulários da Loja (sem componentes).
import { ehCategoriaLoja, precoComDesconto, type CategoriaLoja } from '@/domain/loja'
import { mascararTelefone, soDigitos } from '@/lib/telefone'
import type { Parceiro, Produto } from './api/loja.api'
import { t } from './textos'

export const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp']
export const fotoValida = (f?: File) => !f || (TIPOS_FOTO.includes(f.type) && f.size <= 10_000_000)

export type Preco = { preco: number; modo: 'pct' | 'final'; pct: string; final: number }

/** Preço final em centavos, pelo modo escolhido. */
export const precoFinal = (p: Preco) =>
  p.modo === 'pct' ? precoComDesconto(p.preco, Number(p.pct) || 0) : p.final

export type ValoresProduto = {
  nome: string
  parceiro: string
  categoria: CategoriaLoja
  descricao: string
  preco: Preco
  cupom: string
  link: string
  destaque: boolean
  publicado: boolean
}

export const inicialProduto = (p: Produto | null, parceiro: string): ValoresProduto => ({
  nome: p?.nome ?? '',
  parceiro: p?.parceiro_id ?? parceiro,
  categoria: p && ehCategoriaLoja(p.categoria) ? p.categoria : 'suplementos',
  descricao: p?.descricao ?? '',
  preco: {
    preco: p?.preco_centavos ?? 0,
    modo: 'final',
    pct: '',
    final: p?.preco_final_centavos ?? 0,
  },
  cupom: p?.cupom ?? '',
  link: p?.link_url ?? 'https://',
  destaque: p?.destaque ?? false,
  publicado: p?.publicado ?? false,
})

export function validarProduto(v: ValoresProduto, arquivo?: File) {
  const final = precoFinal(v.preco)
  if (!v.nome.trim()) return t.erros.nome
  if (!v.parceiro) return t.erros.parceiro
  if (v.preco.preco < 1) return t.erros.preco
  if (final < 1 || final > v.preco.preco) return t.erros.final
  if (!/^https:\/\/\S+\.\S+/.test(v.link.trim())) return t.erros.link
  if (!fotoValida(arquivo)) return t.erros.foto
  return null
}

export type ValoresParceiro = {
  nome: string
  descricao: string
  cupom: string
  whatsapp: string
  site: string
  ativo: boolean
}

export function validarParceiro(v: ValoresParceiro, arquivo?: File) {
  const w = soDigitos(v.whatsapp)
  if (!v.nome.trim()) return t.erros.nome
  if (w && (w.length < 10 || w.length > 13)) return t.erros.whatsapp
  if (v.site.trim() && !/^https:\/\/\S+\.\S+/.test(v.site.trim())) return t.erros.link
  if (!fotoValida(arquivo)) return t.erros.foto
  return null
}

export const inicialParceiro = (p: Parceiro | null): ValoresParceiro => ({
  nome: p?.nome ?? '',
  descricao: p?.descricao ?? '',
  cupom: p?.cupom ?? '',
  whatsapp: p?.whatsapp ? mascararTelefone(p.whatsapp) : '',
  site: p?.site_url ?? '',
  ativo: p?.ativo ?? true,
})
