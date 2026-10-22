// O que cada profissional criou dentro do tema: cardápios, tipos de treino, treinos e desafios.
import { supabase } from '@/lib/supabase'
import { ok } from './conteudo.api'

export type ItemDoTema = { id: string; titulo: string; publicado: boolean; detalhe?: string }
export type DoTema = {
  cardapios: ItemDoTema[]
  tipos: ItemDoTema[]
  treinos: ItemDoTema[]
  desafios: ItemDoTema[]
}

export async function listarDoTema(tema: string): Promise<DoTema> {
  const [cardapios, tipos, treinos, desafios] = await Promise.all([
    supabase.from('cardapios').select('id, titulo, publicado').eq('tema_id', tema).order('titulo'),
    supabase.from('rotinas').select('id, nome, publicado').eq('tema_id', tema).order('nome'),
    supabase
      .from('treinos')
      .select('id, nome, publicado, nivel, local')
      .eq('tema_id', tema)
      .order('nome'),
    supabase.from('desafios').select('id, nome, publicado').eq('tema_id', tema).order('nome'),
  ])
  const nomeado = (x: { id: string; nome: string; publicado: boolean }) => ({
    id: x.id,
    titulo: x.nome,
    publicado: x.publicado,
  })
  return {
    cardapios: ok(cardapios),
    tipos: ok(tipos).map(nomeado),
    treinos: ok(treinos).map((x) => ({ ...nomeado(x), detalhe: `${x.nivel} · ${x.local}` })),
    desafios: ok(desafios).map(nomeado),
  }
}
