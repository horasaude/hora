import { enviarEmail } from '../_shared/email/enviar.ts'
import { boasVindas, cobrancaRecusada, linkWhatsApp } from '../_shared/email/modelos.ts'
import { servico, SITE } from '../_shared/servico.ts'
import { rpc } from './eventos.ts'

export type Pedido = {
  id: string
  nome: string
  email: string
  plano: 'pix' | 'parcelado' | 'recorrente'
  status: string
  perfil_id: string | null
  boas_vindas_em: string | null
  mp_assinatura_id: string | null
}

export const CAMPOS_PEDIDO =
  'id, nome, email, plano, status, perfil_id, boas_vindas_em, mp_assinatura_id'

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
  const { data, error } = await servico.auth.admin.generateLink({
    type: 'recovery',
    email: p.email,
    options: { redirectTo: `${SITE}/definir-senha` },
  })
  if (error) throw new Error(`link de senha: ${error.message}`)
  const email = boasVindas({
    site: SITE,
    nome: p.nome,
    whatsapp: whatsapp(),
    link: data.properties.action_link,
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
  return novo
}

export async function avisarRecusa(p: Pedido, cobranca: string): Promise<void> {
  const link = `${SITE}/checkout/cartao?pedido=${p.id}`
  await enviarEmail(
    p.email,
    cobrancaRecusada({ site: SITE, nome: p.nome, whatsapp: whatsapp(), link }),
    `recusa-${cobranca}`,
  )
}
