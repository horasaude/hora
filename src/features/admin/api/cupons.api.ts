import { supabase } from '@/lib/supabase'
import type { TablesInsert } from '@/types/database'
import type { CupomLinha } from '../schemas/cupomForm'
import { ok } from './conteudo.api'

/** Cupons com os usos (pedidos pagos), os mais novos primeiro. */
export async function listarCupons(): Promise<CupomLinha[]> {
  const r = await supabase
    .from('cupons')
    .select('*, usos')
    .order('created_at', { ascending: false })
  return ok(r) as unknown as CupomLinha[]
}

export async function salvarCupom({
  id,
  linha,
}: {
  id: string | null
  linha: Partial<TablesInsert<'cupons'>>
}): Promise<void> {
  if (id) ok(await supabase.from('cupons').update(linha).eq('id', id))
  else ok(await supabase.from('cupons').insert(linha as TablesInsert<'cupons'>))
}
