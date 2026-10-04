import { supabase } from '@/lib/supabase'
import type { LoginDados } from '../schemas/login.schema'

export async function entrarComSenha({ email, senha }: LoginDados) {
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (error) throw error
}

export async function sair() {
  await supabase.auth.signOut()
}
