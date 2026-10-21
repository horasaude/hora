// O que a aluna já fez e o que falta (pendencias_aluna) e o pedido para ela fazer (Edge Function lembrar-aluna).
import { supabase } from '@/lib/supabase'

export type Pendencia = {
  item: string
  nome: string
  feito: boolean
  andamento: boolean
  lembrada_em: string | null
}

export async function listarPendencias(perfil: string): Promise<Pendencia[]> {
  const { data, error } = await supabase.rpc('pendencias_aluna', { p_perfil: perfil })
  if (error) throw error
  return (data ?? []) as Pendencia[]
}

/** Avisa a aluna no app (e no celular, se ela ativou); volta se o aviso é novo. */
export async function lembrarAluna(d: { perfil: string; item: string }): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke<{ ok: boolean; novo?: boolean }>(
    'lembrar-aluna',
    { body: d },
  )
  if (error || !data?.ok) throw error ?? new Error('lembrar')
  return Boolean(data.novo)
}
