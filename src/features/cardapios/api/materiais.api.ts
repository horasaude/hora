import { supabase } from '@/lib/supabase'

export type Material = { id: string; titulo: string; texto: string; tema_id: string | null }

/** Materiais publicados pela nutricionista (o banco só entrega a quem tem acesso). */
export async function buscarMateriais(): Promise<Material[]> {
  const { data, error } = await supabase
    .from('materiais_nutricao')
    .select('id, titulo, texto, tema_id')
    .eq('publicado', true)
    .order('ordem')
    .order('created_at')
  if (error) throw error
  return data ?? []
}
