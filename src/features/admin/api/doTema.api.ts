// O que cada profissional criou dentro do tema: cardápios, treinos e desafios.
import { supabase } from '@/lib/supabase'
import { ok } from './conteudo.api'

export type ItemDoTema = { id: string; titulo: string; publicado: boolean; detalhe?: string }
export type DoTema = { cardapios: ItemDoTema[]; treinos: ItemDoTema[]; desafios: ItemDoTema[] }

export async function listarDoTema(tema: string): Promise<DoTema> {
  const [cardapios, treinos, desafios] = await Promise.all([
    supabase.from('cardapios').select('id, titulo, publicado').eq('tema_id', tema).order('titulo'),
    supabase
      .from('treinos')
      .select('id, nome, publicado, nivel, local')
      .eq('tema_id', tema)
      .order('nome'),
    supabase.from('desafios').select('id, nome, publicado').eq('tema_id', tema).order('nome'),
  ])
  return {
    cardapios: ok(cardapios),
    treinos: ok(treinos).map((x) => ({
      id: x.id,
      titulo: x.nome,
      publicado: x.publicado,
      detalhe: `${x.nivel} · ${x.local}`,
    })),
    desafios: ok(desafios).map((x) => ({ id: x.id, titulo: x.nome, publicado: x.publicado })),
  }
}
