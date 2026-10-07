import { z } from 'zod'
import { PLANOS, type Plano } from '@/domain/precos'

const CHAVE = 'ora:inscricao'

const esquema = z.object({
  plano: z.enum(PLANOS),
  nome: z.string().max(120),
  email: z.string().max(254),
  whatsapp: z.string().max(20),
})

export type Inscricao = z.infer<typeof esquema>

/**
 * O popup da página de vendas guarda aqui o que a pessoa digitou, e o checkout lê.
 * Fica só na sessão do navegador: dado pessoal nunca vai no endereço da página.
 */
export function salvarInscricao(dados: Inscricao): void {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(dados))
  } catch {
    // navegação privada pode bloquear; o checkout abre vazio e a pessoa preenche
  }
}

export function lerInscricao(): Inscricao | null {
  try {
    const r = esquema.safeParse(JSON.parse(sessionStorage.getItem(CHAVE) ?? 'null'))
    return r.success ? r.data : null
  } catch {
    return null
  }
}

export const PLANO_PADRAO: Plano = 'parcelado'
