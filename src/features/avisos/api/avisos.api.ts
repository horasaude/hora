import { supabase } from '@/lib/supabase'

export type Aviso = { id: string; titulo: string; texto: string; publicar_em: string }

/** Avisos publicados dos últimos 30 dias (o banco só libera os já publicados para a aluna). */
export async function listarAvisos(): Promise<Aviso[]> {
  const desde = new Date(Date.now() - 30 * 86_400_000).toISOString()
  const { data, error } = await supabase
    .from('avisos')
    .select('id, titulo, texto, publicar_em')
    .eq('publicado', true)
    .lte('publicar_em', new Date().toISOString())
    .gte('publicar_em', desde)
    .order('publicar_em', { ascending: false })
    .limit(10)
  if (error) throw error
  return data
}
