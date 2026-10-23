// Usar no tema um cardápio ou treino que já existe: sem tema, passa a ser deste tema;
// já de outro tema, ganha uma cópia aqui e o original continua onde estava.
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'
import { buscarTreino, salvarTreino } from '../treinos/api/treinos.api'
import { ok } from './conteudo.api'

export async function usarCardapio(id: string, tema: string): Promise<void> {
  const c: Tables<'cardapios'> = ok(
    await supabase.from('cardapios').select('*').eq('id', id).single(),
  )
  if (!c.tema_id) {
    ok(await supabase.from('cardapios').update({ tema_id: tema }).eq('id', id))
    return
  }
  const { id: _id, created_at: _c, updated_at: _u, busca: _b, ...resto } = c
  ok(await supabase.from('cardapios').insert({ ...resto, tema_id: tema, publicado: false }))
}

export async function usarTreino(id: string, tema: string): Promise<void> {
  const { treino, itens } = await buscarTreino(id)
  if (!treino.tema_id) {
    ok(await supabase.from('treinos').update({ tema_id: tema }).eq('id', id))
    return
  }
  const { id: _id, created_at: _c, updated_at: _u, ...resto } = treino
  await salvarTreino({ treino: { ...resto, tema_id: tema, publicado: false }, itens })
}
