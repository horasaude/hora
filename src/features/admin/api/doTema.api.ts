// O que cada profissional criou dentro do tema: cardápios, receitas, materiais, tipos de treino e desafios.
import { nivelLocal } from '@/domain/treinos'
import { supabase } from '@/lib/supabase'
import { ok } from './conteudo.api'

export type ItemDoTema = { id: string; titulo: string; publicado: boolean; detalhe?: string }
export type DoTema = {
  cardapios: ItemDoTema[]
  receitas: ItemDoTema[]
  materiais: ItemDoTema[]
  saude: ItemDoTema[]
  tipos: ItemDoTema[]
  desafios: ItemDoTema[]
}

export async function listarDoTema(tema: string): Promise<DoTema> {
  const [cardapios, receitas, materiais, tipos, desafios, saude] = await Promise.all([
    supabase.from('cardapios').select('id, titulo, publicado').eq('tema_id', tema).order('titulo'),
    supabase.from('receitas').select('id, nome, publicado').eq('tema_id', tema).order('nome'),
    supabase
      .from('materiais_nutricao')
      .select('id, titulo, publicado')
      .eq('tema_id', tema)
      .eq('area', 'nutricao')
      .order('ordem'),
    supabase
      .from('rotinas')
      .select('id, nome, publicado, nivel, local')
      .eq('tema_id', tema)
      .order('nome'),
    supabase.from('desafios').select('id, nome, publicado').eq('tema_id', tema).order('nome'),
    supabase
      .from('materiais_nutricao')
      .select('id, titulo, publicado')
      .eq('tema_id', tema)
      .eq('area', 'saude')
      .order('ordem'),
  ])
  const nomeado = (x: { id: string; nome: string; publicado: boolean }) => ({
    id: x.id,
    titulo: x.nome,
    publicado: x.publicado,
  })
  return {
    cardapios: ok(cardapios),
    receitas: ok(receitas).map(nomeado),
    materiais: ok(materiais),
    tipos: ok(tipos).map((x) => ({ ...nomeado(x), detalhe: nivelLocal(x.nivel, x.local) })),
    desafios: ok(desafios).map(nomeado),
    saude: ok(saude),
  }
}
