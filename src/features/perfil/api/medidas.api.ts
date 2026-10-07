import { linksDasFotos, subirFoto } from '@/lib/fotos'
import { supabase } from '@/lib/supabase'

export const CAMPOS_MEDIDA = ['peso', 'cintura', 'quadril', 'braco', 'coxa'] as const
export type CampoMedida = (typeof CAMPOS_MEDIDA)[number]

export type Medida = { id: string; dia: string; foto_path: string | null; foto?: string } & Record<
  CampoMedida,
  number | null
>

/** Registros de medidas dela, do mais novo ao mais antigo, com link da foto. */
export async function buscarMedidas(): Promise<Medida[]> {
  const { data, error } = await supabase
    .from('medidas')
    .select('id, dia, peso, cintura, quadril, braco, coxa, foto_path')
    .order('dia', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  const linhas = data ?? []
  const links = await linksDasFotos(
    'evolucao',
    linhas.map((m) => m.foto_path),
  )
  return linhas.map((m) => ({ ...m, foto: m.foto_path ? links.get(m.foto_path) : undefined }))
}

export type NovaMedida = { dia: string; arquivo: File | null } & Record<CampoMedida, number | null>

export async function registrarMedida({ arquivo, ...campos }: NovaMedida): Promise<void> {
  const foto_path = arquivo ? await subirFoto('evolucao', 'medida', arquivo) : null
  const { error } = await supabase.from('medidas').insert({ ...campos, foto_path })
  if (error) throw error
}

export async function apagarMedida(m: Pick<Medida, 'id' | 'foto_path'>): Promise<void> {
  const { error } = await supabase.from('medidas').delete().eq('id', m.id)
  if (error) throw error
  if (m.foto_path) await supabase.storage.from('evolucao').remove([m.foto_path])
}
