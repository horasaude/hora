// TS puro: roda no Deno (import de zod pelo deno.json) e no vitest (zod do node_modules).
import { z } from 'zod'

const texto = (max: number) => z.string().trim().max(max)
const opcional = (max: number) =>
  texto(max)
    .optional()
    .transform((v) => v || null)

const esquema = z.object({
  nome: texto(120).min(2),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().regex(/^[0-9]{10,11}$/)),
  plano: z.enum(['pix', 'parcelado', 'recorrente']),
  aceite: z.literal(true),
  versaoTermos: texto(40).min(1),
  origem: opcional(500),
  utm: z
    .object({
      source: opcional(200),
      medium: opcional(200),
      campaign: opcional(200),
      content: opcional(200),
      term: opcional(200),
    })
    .default({ source: null, medium: null, campaign: null, content: null, term: null }),
})

export type LinhaInteressada = {
  nome: string
  email: string
  whatsapp: string
  plano_escolhido: 'pix' | 'parcelado' | 'recorrente'
  aceitou_termos_em: string
  versao_termos: string
  origem: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
}

export type Resultado =
  { tipo: 'robo' } | { tipo: 'invalido' } | { tipo: 'ok'; linha: LinhaInteressada }

/** Honeypot: o campo "site" fica escondido na tela; se veio preenchido, foi robô. */
function ehRobo(corpo: unknown): boolean {
  if (typeof corpo !== 'object' || corpo === null || !('site' in corpo)) return false
  const site = (corpo as { site: unknown }).site
  return typeof site !== 'string' || site.trim() !== ''
}

/** Decide o que fazer com o corpo recebido. O horário do aceite é o do servidor. */
export function prepararCadastro(corpo: unknown, agora: Date): Resultado {
  if (ehRobo(corpo)) return { tipo: 'robo' }
  const r = esquema.safeParse(corpo)
  if (!r.success) return { tipo: 'invalido' }
  const d = r.data
  return {
    tipo: 'ok',
    linha: {
      nome: d.nome,
      email: d.email,
      whatsapp: d.whatsapp,
      plano_escolhido: d.plano,
      aceitou_termos_em: agora.toISOString(),
      versao_termos: d.versaoTermos,
      origem: d.origem,
      utm_source: d.utm.source,
      utm_medium: d.utm.medium,
      utm_campaign: d.utm.campaign,
      utm_content: d.utm.content,
      utm_term: d.utm.term,
    },
  }
}
