// Usar no tema um cardápio, treino ou tipo de treino que já existe: sem tema, passa a ser deste tema;
// já de outro tema, ganha uma cópia aqui e o original continua onde estava.
// Receita e material da nutricionista têm um tema só: escolher aqui muda o tema dele.
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'
import {
  buscarTreino,
  salvarRotina,
  salvarTreino,
  type DiaRotina,
  type Rotina,
} from '../treinos/api/treinos.api'
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

/** Devolve o id do treino que vale neste tema (o mesmo, ou a cópia feita aqui). */
export async function usarTreino(id: string, tema: string): Promise<string> {
  const { treino, itens } = await buscarTreino(id)
  if (treino.tema_id === tema) return id
  if (!treino.tema_id) {
    ok(await supabase.from('treinos').update({ tema_id: tema }).eq('id', id))
    return id
  }
  const { id: _id, created_at: _c, updated_at: _u, ...resto } = treino
  return salvarTreino({ treino: { ...resto, tema_id: tema, publicado: false }, itens })
}

/** Treinos escolhidos no tipo: os de outro tema viram cópias deste tema, senão a aluna não os vê. */
export async function trazerTreinos<T extends { treino_id: string }>(
  dias: T[],
  tema: string,
): Promise<T[]> {
  const ids = [...new Set(dias.map((d) => d.treino_id))]
  if (ids.length === 0) return dias
  const lidos = ok(await supabase.from('treinos').select('id, tema_id').in('id', ids))
  const novos = new Map<string, string>()
  for (const x of lidos) if (x.tema_id !== tema) novos.set(x.id, await usarTreino(x.id, tema))
  return dias.map((d) => ({ ...d, treino_id: novos.get(d.treino_id) ?? d.treino_id }))
}

/** Tipo de treino de outro tema: cópia em rascunho aqui, com cópias dos treinos dele. */
export async function usarTipo(r: Rotina, tema: string): Promise<void> {
  const { id: _id, created_at: _c, updated_at: _u, dias, ...resto } = r
  const lidos: DiaRotina[] = dias.map(({ categoria: _cat, ...d }) => d)
  await salvarRotina({
    rotina: { ...resto, tema_id: tema, publicado: false },
    dias: await trazerTreinos(lidos, tema),
  })
}

export async function usarReceita(id: string, tema: string): Promise<void> {
  ok(await supabase.from('receitas').update({ tema_id: tema }).eq('id', id))
}

export async function usarMaterial(id: string, tema: string): Promise<void> {
  ok(await supabase.from('materiais_nutricao').update({ tema_id: tema }).eq('id', id))
}
