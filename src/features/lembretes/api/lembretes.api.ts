import { supabase } from '@/lib/supabase'

export type Pedido = { item: string; nome: string; para: string; lembrada_em: string }

/** O que a equipe pediu e ela ainda não fez (o banco tira da lista quando ela faz). */
export async function buscarPedidos(): Promise<Pedido[]> {
  const { data, error } = await supabase.rpc('meus_lembretes')
  if (error) throw error
  return (data ?? []) as Pedido[]
}
