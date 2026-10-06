import { supabase } from '@/lib/supabase'
import type { LoginDados } from '../schemas/login.schema'

export async function entrarComSenha({ email, senha }: LoginDados) {
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (error) throw error
}

export async function sair() {
  await supabase.auth.signOut()
}

export async function buscarPapel(): Promise<string | null> {
  const { data: sessao } = await supabase.auth.getUser()
  if (!sessao.user) return null
  const { data, error } = await supabase
    .from('perfis')
    .select('papel')
    .eq('id', sessao.user.id)
    .single()
  if (error) throw error
  return data.papel
}
