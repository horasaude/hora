// Conexão com a conta Google da ORA (OAuth, feita uma vez pelo painel) e criação de salas do Meet.
// Chaves nos secrets GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET; o refresh token fica em conexao_google.

const ESCOPOS = ['openid', 'email', 'https://www.googleapis.com/auth/meetings.space.created'].join(
  ' ',
)

export const RETORNO = 'https://zijtjwhvnhfarmfscmnr.supabase.co/functions/v1/google-retorno'
const VALIDADE_ESTADO_MS = 15 * 60_000

const cliente = () => ({
  id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
  segredo: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
})

async function hmac(segredo: string, texto: string): Promise<string> {
  const chave = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(segredo),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const assinado = await crypto.subtle.sign('HMAC', chave, new TextEncoder().encode(texto))
  return Array.from(new Uint8Array(assinado), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Estado do OAuth: quem pediu e quando, assinado; o retorno só aceita o que o painel gerou. */
export async function assinarEstado(perfil: string, segredo: string, agora = Date.now()) {
  const base = `${perfil}.${agora}`
  return `${base}.${await hmac(segredo, base)}`
}

export async function validarEstado(estado: string, segredo: string, agora = Date.now()) {
  const [perfil, quando, assinatura] = estado.split('.')
  if (!perfil || !quando || !assinatura || !segredo) return null
  if (agora - Number(quando) > VALIDADE_ESTADO_MS || Number(quando) > agora) return null
  return (await hmac(segredo, `${perfil}.${quando}`)) === assinatura ? perfil : null
}

export function urlAutorizacao(estado: string, clienteId = cliente().id): string {
  const p = new URLSearchParams({
    client_id: clienteId,
    redirect_uri: RETORNO,
    response_type: 'code',
    scope: ESCOPOS,
    access_type: 'offline',
    prompt: 'consent',
    state: estado,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${p}`
}

async function token(corpo: Record<string, string>) {
  const c = cliente()
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: c.id, client_secret: c.segredo, ...corpo }),
  })
  const j = (await r.json().catch(() => ({}))) as Record<string, string>
  if (!r.ok) throw new Error(`google token ${r.status} ${j.error ?? ''}`)
  return j
}

/** Troca o código do retorno pelo refresh token e descobre o e-mail da conta. */
export async function trocarCodigo(codigo: string) {
  const t = await token({ code: codigo, grant_type: 'authorization_code', redirect_uri: RETORNO })
  const r = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${t.access_token}` },
  })
  const u = (await r.json().catch(() => ({}))) as { email?: string }
  return { refresh: t.refresh_token ?? '', conta: u.email ?? '' }
}

export const acessoPor = async (refresh: string) =>
  (await token({ refresh_token: refresh, grant_type: 'refresh_token' })).access_token

/** Sala aberta: quem tem o link entra sem pedir para participar (o link só aparece no ORA). */
export const CONFIG_SALA = { config: { accessType: 'OPEN', entryPointAccess: 'ALL' } }

export type Sala = { name: string; meetingUri: string }

export async function criarSala(acesso: string): Promise<Sala> {
  const r = await fetch('https://meet.googleapis.com/v2/spaces', {
    method: 'POST',
    headers: { Authorization: `Bearer ${acesso}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(CONFIG_SALA),
  })
  const j = (await r.json().catch(() => ({}))) as Partial<Sala> & { error?: { message?: string } }
  if (!r.ok || !j.name || !j.meetingUri)
    throw new Error(`meet ${r.status} ${j.error?.message ?? ''}`.trim())
  return { name: j.name, meetingUri: j.meetingUri }
}
