// Validação do pedido do painel: cadastrar profissional (com senha ou com link), gerar novo link
// de acesso ou definir a senha de quem já está na equipe.

const ESPECIALIDADES = ['alimentacao', 'saude', 'treino'] as const
type Especialidade = (typeof ESPECIALIDADES)[number]

export type Pedido =
  | {
      acao: 'convidar'
      nome: string
      email: string
      especialidade: Especialidade | null
      titulo: string | null
      /** Com senha, a conta já nasce pronta para entrar; sem ela, volta o link de acesso. */
      senha: string | null
    }
  | { acao: 'link'; perfil: string }
  | { acao: 'senha'; perfil: string; senha: string }

/** Senha de 8 a 72 caracteres (o limite do Supabase Auth). */
const senhaValida = (v: unknown): v is string =>
  typeof v === 'string' && v.length >= 8 && v.length <= 72

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const texto = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/** Pedido válido ou null. E-mail vai em minúsculas; título e especialidade vazios viram null. */
export function lerPedido(corpo: unknown): Pedido | null {
  if (!corpo || typeof corpo !== 'object') return null
  const c = corpo as Record<string, unknown>
  if (c.acao === 'link')
    return UUID.test(texto(c.perfil)) ? { acao: 'link', perfil: texto(c.perfil) } : null
  if (c.acao === 'senha')
    return UUID.test(texto(c.perfil)) && senhaValida(c.senha)
      ? { acao: 'senha', perfil: texto(c.perfil), senha: c.senha }
      : null
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
  if (c.senha !== undefined && c.senha !== null && c.senha !== '' && !senhaValida(c.senha))
    return null
  return {
    acao: 'convidar',
    nome,
    email,
    especialidade: ehEsp(esp) ? esp : null,
    titulo: titulo || null,
    senha: senhaValida(c.senha) ? c.senha : null,
  }
}
