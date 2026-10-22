import { supabase } from '@/lib/supabase'

export type Pendencia = { pausado: boolean; fatura_url: string | null }

/** Mensalidade em aberto da aluna logada (com a fatura do Asaas), ou null se está tudo pago. */
export async function buscarPendencia(): Promise<Pendencia | null> {
  const { data, error } = await supabase.rpc('minha_pendencia')
  if (error) throw error
  return data?.[0] ?? null
}
