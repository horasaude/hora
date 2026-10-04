import { env } from '@/lib/env'
import { soDigitos } from '@/lib/telefone'
import { utmsGuardadas } from '@/lib/utm'
import type { Compra } from '../schemas/compra'

const URL_FUNCAO = `${env.VITE_SUPABASE_URL}/functions/v1/cadastrar-interessada`

/**
 * Grava o lead na Edge Function. Nunca lança e espera no máximo `esperaMs`:
 * a venda segue para o pagamento mesmo se o cadastro falhar.
 */
export async function registrarLead(dados: Compra, esperaMs = 4000): Promise<boolean> {
  const controle = new AbortController()
  const id = window.setTimeout(() => controle.abort(), esperaMs)
  try {
    const resposta = await fetch(URL_FUNCAO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      signal: controle.signal,
      body: JSON.stringify({
        nome: dados.nome,
        email: dados.email,
        whatsapp: soDigitos(dados.whatsapp),
        plano: dados.plano,
        origem: document.referrer.slice(0, 500) || undefined,
        utm: utmsGuardadas(),
        site: dados.site ?? '',
      }),
    })
    return resposta.ok
  } catch {
    return false
  } finally {
    window.clearTimeout(id)
  }
}
