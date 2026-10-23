// API de Conversões da Meta: a compra aprovada vai pelo servidor, com o mesmo id do evento do
// navegador (o id do pedido), e a Meta conta uma vez só. Sem META_CAPI_TOKEN, não manda nada.
// Quem recusou os cookies no site também fica de fora.

export const PIXEL_META = '2586011068587810'
const VERSAO = 'v21.0'

export type Rastreio = { fbp?: string; fbc?: string; ip?: string; ua?: string; recusou?: boolean }

export type CompraMeta = {
  pedido: string
  nome: string
  email: string
  whatsapp: string
  valorCentavos: number
  plano: string
  rastreio: Rastreio
  site: string
  quando?: Date
}

async function sha256(texto: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto))
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const limpar = (v: string) =>
  v
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '')

/** Evento Purchase no formato da Meta, com os dados pessoais em SHA-256 como ela pede. */
export async function eventoCompra(c: CompraMeta) {
  const partes = c.nome.trim().split(/\s+/)
  const fone = c.whatsapp.replace(/\D/g, '')
  const r = c.rastreio
  return {
    event_name: 'Purchase',
    event_time: Math.floor((c.quando ?? new Date()).getTime() / 1000),
    event_id: c.pedido,
    action_source: 'website',
    event_source_url: `${c.site}/obrigada`,
    user_data: {
      em: [await sha256(c.email.trim().toLowerCase())],
      ph: [await sha256(fone.startsWith('55') ? fone : `55${fone}`)],
      fn: [await sha256(limpar(partes[0] ?? ''))],
      ln: [await sha256(limpar(partes.at(-1) ?? ''))],
      country: [await sha256('br')],
      external_id: [await sha256(c.pedido)],
      ...(r.ip && { client_ip_address: r.ip }),
      ...(r.ua && { client_user_agent: r.ua }),
      ...(r.fbp && { fbp: r.fbp }),
      ...(r.fbc && { fbc: r.fbc }),
    },
    custom_data: { value: c.valorCentavos / 100, currency: 'BRL', content_name: c.plano },
  }
}

/** Manda a compra. Nunca lança erro: a Meta fora do ar não pode travar a liberação do acesso. */
export async function enviarCompraMeta(c: CompraMeta): Promise<void> {
  const token = Deno.env.get('META_CAPI_TOKEN')
  if (!token || c.rastreio.recusou) return
  try {
    const teste = Deno.env.get('META_CAPI_TESTE')
    const r = await fetch(`https://graph.facebook.com/${VERSAO}/${PIXEL_META}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [await eventoCompra(c)],
        access_token: token,
        ...(teste && { test_event_code: teste }),
      }),
      signal: AbortSignal.timeout(5000),
    })
    if (!r.ok) console.error('meta capi', r.status, (await r.text()).slice(0, 300))
  } catch (e) {
    console.error('meta capi', e instanceof Error ? e.message : e)
  }
}
