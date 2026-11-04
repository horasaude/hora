// Validação do pedido do painel: cadastrar parceira (nome, e-mail e prazo) ou reenviar o e-mail dela.

export const PRAZOS = [1, 3, 6, 12] as const

export type Pedido =
  | { acao: 'cadastrar'; nome: string; email: string; meses: (typeof PRAZOS)[number] }
  | { acao: 'reenviar'; perfil: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const texto = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const ehPrazo = (v: unknown): v is (typeof PRAZOS)[number] => PRAZOS.some((p) => p === v)

/** Pedido válido ou null. E-mail vai em minúsculas. */
export function lerPedido(corpo: unknown): Pedido | null {
  if (!corpo || typeof corpo !== 'object') return null
  const c = corpo as Record<string, unknown>
  if (c.acao === 'reenviar')
    return UUID.test(texto(c.perfil)) ? { acao: 'reenviar', perfil: texto(c.perfil) } : null
  if (c.acao !== 'cadastrar') return null
  const nome = texto(c.nome)
  const email = texto(c.email).toLowerCase()
  if (nome.length < 1 || nome.length > 120) return null
  if (!EMAIL.test(email) || email.length > 200) return null
  if (!ehPrazo(c.meses)) return null
  return { acao: 'cadastrar', nome, email, meses: c.meses }
}
