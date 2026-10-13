import type { Session } from '@supabase/supabase-js'

// A página de criar senha só vale para a sessão que acabou de nascer do link do e-mail.
// Sem isso, um link gasto aberto num navegador já logado trocava a senha da conta errada.

export const VALIDADE_LINK_MS = 15 * 60_000

/** O endereço trouxe erro do link (expirado ou já usado)? */
export function linkComErro(endereco: { hash: string; search: string }): boolean {
  return /(^|[#&?])error(_code)?=/.test(`${endereco.hash}&${endereco.search}`)
}

/** Sessão aberta pelo link agora há pouco (o login pelo link atualiza last_sign_in_at). */
export function sessaoDoLink(sessao: Session | null, agora = Date.now()): boolean {
  const entrou = sessao?.user.last_sign_in_at
  if (!entrou) return false
  return agora - new Date(entrou).getTime() <= VALIDADE_LINK_MS
}
