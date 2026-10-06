import { supabase } from '@/lib/supabase'

export type ProximaLive = { id: string; tema: string; data: string }

/** Próxima live publicada (o banco só entrega as publicadas para quem tem acesso). */
export async function buscarProximaLive(agora: Date): Promise<ProximaLive | null> {
  const { data, error } = await supabase
    .from('lives')
    .select('id, tema, data')
    .gte('data', agora.toISOString())
    .order('data')
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}
