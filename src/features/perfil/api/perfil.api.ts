import { linksDasFotos, minhaPasta, subirFoto } from '@/lib/fotos'
import { supabase } from '@/lib/supabase'

/** Quantas aulas ela concluiu (só as dela; a equipe lê as de todas). */
export async function contarAulasConcluidas(): Promise<number> {
  const { data: sessao } = await supabase.auth.getSession()
  const { count, error } = await supabase
    .from('aulas_concluidas')
    .select('aula_id', { count: 'exact', head: true })
    .eq('perfil_id', sessao.session?.user.id ?? '')
  if (error) throw error
  return count ?? 0
}

/** Link assinado da foto de perfil (espaço privado evolucao). */
export async function linkAvatar(caminho: string | null): Promise<string | null> {
  if (!caminho) return null
  return (await linksDasFotos('avatares', [caminho])).get(caminho) ?? null
}

export type EdicaoPerfil = { apelido: string; arquivo?: File | null }

/** Grava apelido e, se veio, a foto nova (comprimida) na pasta dela. */
export async function salvarPerfil(d: EdicaoPerfil): Promise<void> {
  const id = await minhaPasta()
  const avatar_path = d.arquivo ? await subirFoto('avatares', 'avatar', d.arquivo) : undefined
  const { error } = await supabase
    .from('perfis')
    .update({ apelido: d.apelido, ...(avatar_path ? { avatar_path } : {}) })
    .eq('id', id)
  if (error) throw error
}

/** Liga ou desliga "aparecer no ranking". */
export async function salvarRanking(aparecer: boolean): Promise<void> {
  const id = await minhaPasta()
  const { error } = await supabase
    .from('perfis')
    .update({ ocultar_ranking: !aparecer })
    .eq('id', id)
  if (error) throw error
}

export async function trocarSenha(senha: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: senha })
  if (error) throw error
}
