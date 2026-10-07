// Validação do pedido do painel: convidar profissional ou gerar novo link de acesso.

const ESPECIALIDADES = ['alimentacao', 'saude', 'treino'] as const
type Especialidade = (typeof ESPECIALIDADES)[number]

export type Pedido =
  | {
      acao: 'convidar'
      nome: string
      email: string
      especialidade: Especialidade | null
      titulo: string | null
    }
  | { acao: 'link'; perfil: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const texto = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/** Pedido válido ou null. E-mail vai em minúsculas; título e especialidade vazios viram null. */
export function lerPedido(corpo: unknown): Pedido | null {
  if (!corpo || typeof corpo !== 'object') return null
  const c = corpo as Record<string, unknown>
  if (c.acao === 'link')
    return UUID.test(texto(c.perfil)) ? { acao: 'link', perfil: texto(c.perfil) } : null
  if (c.acao !== 'convidar') return null
  const nome = texto(c.nome)
  const email = texto(c.email).toLowerCase()
  const titulo = texto(c.titulo)
  const esp = texto(c.especialidade)
  const ehEsp = (v: string): v is Especialidade => ESPECIALIDADES.some((e) => e === v)
  if (nome.length < 1 || nome.length > 120) return null
  if (!EMAIL.test(email) || email.length > 200) return null
  if (titulo.length > 80) return null
  if (esp && !ehEsp(esp)) return null
  return {
    acao: 'convidar',
    nome,
    email,
    especialidade: ehEsp(esp) ? esp : null,
    titulo: titulo || null,
  }
}
