import { enviarEmail } from '../_shared/email/enviar.ts'
import { boasVindas } from '../_shared/email/boasVindas.ts'
import { cobrancaRecusada, linkWhatsApp } from '../_shared/email/modelos.ts'
import { enviarCompraMeta, type Rastreio } from '../_shared/metaConversoes.ts'
import { servico, SITE } from '../_shared/servico.ts'
import { rpc } from './eventos.ts'

export type Pedido = {
  id: string
  nome: string
  email: string
  whatsapp: string
  rastreio: Rastreio
  plano: 'pix' | 'parcelado' | 'recorrente'
  status: string
  perfil_id: string | null
  boas_vindas_em: string | null
  mp_assinatura_id: string | null
  valor_centavos: number
  parcelas: number
  meses_acesso: number
  codigo_acesso: string
}

export const CAMPOS_PEDIDO =
  'id, nome, email, whatsapp, rastreio, plano, status, perfil_id, boas_vindas_em, mp_assinatura_id, valor_centavos, parcelas, meses_acesso, codigo_acesso'

const whatsapp = () => linkWhatsApp(Deno.env.get('WHATSAPP_NUMERO'))

/** Conta no Supabase Auth: reaproveita se o e-mail já existe, senão cria já confirmada. */
async function garantirConta(p: Pedido): Promise<string> {
  const existente = await rpc<string | null>('perfil_por_email', { p_email: p.email })
  if (existente) return existente
  const { data, error } = await servico.auth.admin.createUser({
    email: p.email,
    email_confirm: true,
    user_metadata: { nome: p.nome },
  })
  if (error || !data.user) throw new Error(`criar conta: ${error?.message}`)
  return data.user.id
}

async function mandarBoasVindas(p: Pedido): Promise<void> {
  const email = boasVindas({
    site: SITE,
    nome: p.nome,
    email: p.email,
    whatsapp: whatsapp(),
    link: `${SITE}/acesso/${p.codigo_acesso}`,
    compra: {
      plano: p.plano,
      valorCentavos: p.valor_centavos,
      parcelas: p.parcelas,
      meses: p.meses_acesso,
    },
  })
  if (await enviarEmail(p.email, email, `boas-vindas-${p.id}`))
    await servico
      .from('pedidos')
      .update({ boas_vindas_em: new Date().toISOString() })
      .eq('id', p.id)
}

/** Pagamento confirmado na API: conta, acesso de 12 (ou 13) meses, histórico e boas-vindas. */
export async function liberar(p: Pedido, aprovadoEm: string): Promise<boolean> {
  const perfil = p.perfil_id ?? (await garantirConta(p))
  const novo = await rpc<boolean>('aprovar_pedido', {
    p_pedido: p.id,
    p_perfil: perfil,
    p_aprovado_em: aprovadoEm,
  })
  if (!p.boas_vindas_em) await mandarBoasVindas(p)
  if (novo)
    await enviarCompraMeta({
      pedido: p.id,
      nome: p.nome,
      email: p.email,
      whatsapp: p.whatsapp,
      valorCentavos: p.valor_centavos,
      plano: p.plano,
      rastreio: p.rastreio ?? {},
      site: SITE,
    })
  return novo
}

/** Mensalidade recusada: o link é a própria cobrança no Asaas, onde ela paga com outro cartão. */
export async function avisarRecusa(p: Pedido, cobranca: string, fatura?: string): Promise<void> {
  const link = fatura ?? `${SITE}/entrar`
  await enviarEmail(
    p.email,
    cobrancaRecusada({ site: SITE, nome: p.nome, whatsapp: whatsapp(), link }),
    `recusa-${cobranca}`,
  )
}
