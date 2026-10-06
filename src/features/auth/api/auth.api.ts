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

/** Nome da usuária logada, para mostrar no painel. */
export async function buscarNome(): Promise<string | null> {
  const { data: sessao } = await supabase.auth.getUser()
  if (!sessao.user) return null
  const { data, error } = await supabase
    .from('perfis')
    .select('nome')
    .eq('id', sessao.user.id)
    .single()
  if (error) throw error
  return data.nome
}

export type MeuPerfil = {
  nome: string
  apelido: string | null
  papel: string
  consentimento_saude_em: string | null
  acesso_inicio_em: string | null
}

/** Perfil da usuária logada: nome, apelido, consentimento e início do acesso. */
export async function buscarMeuPerfil(): Promise<MeuPerfil | null> {
  const { data: sessao } = await supabase.auth.getUser()
  if (!sessao.user) return null
  const { data, error } = await supabase
    .from('perfis')
    .select('nome, apelido, papel, consentimento_saude_em, acesso_inicio_em')
    .eq('id', sessao.user.id)
    .single()
  if (error) throw error
  return data
}

/** Marca o último acesso da aluna (o banco só grava se passou de 5 minutos). Falha não atrapalha. */
export async function registrarAcesso(): Promise<void> {
  await supabase.rpc('registrar_acesso')
}
