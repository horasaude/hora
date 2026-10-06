import { supabase } from '@/lib/supabase'

/** Grava o apelido e o momento do aceite do uso dos dados de saúde. */
export async function salvarPrimeiroAcesso(apelido: string): Promise<void> {
  const { data: sessao } = await supabase.auth.getUser()
  if (!sessao.user) throw new Error('sem sessão')
  const { error } = await supabase
    .from('perfis')
    .update({ apelido, consentimento_saude_em: new Date().toISOString() })
    .eq('id', sessao.user.id)
  if (error) throw error
}
