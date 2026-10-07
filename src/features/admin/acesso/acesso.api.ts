import { supabase } from '@/lib/supabase'

export type Liberacao = { quando: string; quem: string | null; inicio: string }

/** Última liberação manual de acesso da aluna e quem fez. */
export async function buscarLiberacao(perfil: string): Promise<Liberacao | null> {
  const { data, error } = await supabase
    .from('acessos_liberados')
    .select('created_at, inicio, liberado_por')
    .eq('perfil_id', perfil)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  let quem: string | null = null
  if (data.liberado_por) {
    const p = await supabase
      .from('perfis')
      .select('nome, apelido')
      .eq('id', data.liberado_por)
      .maybeSingle()
    quem = p.data?.nome || p.data?.apelido || null
  }
  return { quando: data.created_at, quem, inicio: data.inicio }
}

/** Libera o acesso a partir da data (AAAA-MM-DD), por 12 meses; o banco registra quem e quando. */
export async function liberarAcesso(perfil: string, inicio: string): Promise<void> {
  const { error } = await supabase.rpc('liberar_acesso', { p_perfil: perfil, p_inicio: inicio })
  if (error) throw error
}
