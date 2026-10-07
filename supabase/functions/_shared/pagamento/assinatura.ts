// Validação da assinatura x-signature das notificações do Mercado Pago, como no SDK oficial
// (WebhookSignatureValidator): manifesto "id:<data.id>;request-id:<x-request-id>;ts:<ts>;",
// HMAC SHA-256 em hexadecimal com a chave secreta do webhook. Par sem valor sai do manifesto.

export type Assinatura = { ts: string; v1: string }

export function lerAssinatura(cabecalho: string | null): Assinatura | null {
  if (!cabecalho) return null
  let ts = ''
  let v1 = ''
  for (const parte of cabecalho.split(',')) {
    const i = parte.indexOf('=')
    if (i === -1) continue
    const chave = parte.slice(0, i).trim().toLowerCase()
    const valor = parte.slice(i + 1).trim()
    if (chave === 'ts') ts = valor
    if (chave === 'v1') v1 = valor
  }
  return /^\d+$/.test(ts) && /^[0-9a-f]{64}$/i.test(v1) ? { ts, v1: v1.toLowerCase() } : null
}

export function manifesto(dataId: string | null, requestId: string | null, ts: string): string {
  const partes: string[] = []
  if (dataId) partes.push(`id:${dataId}`)
  if (requestId) partes.push(`request-id:${requestId}`)
  partes.push(`ts:${ts}`)
  return partes.join(';') + ';'
}

export async function hmacHex(segredo: string, mensagem: string): Promise<string> {
  const chave = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(segredo),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const assinado = await crypto.subtle.sign('HMAC', chave, new TextEncoder().encode(mensagem))
  return Array.from(new Uint8Array(assinado), (b) => b.toString(16).padStart(2, '0')).join('')
}

function iguais(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let dif = 0
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return dif === 0
}

type Entrada = {
  xSignature: string | null
  xRequestId: string | null
  dataId: string | null
  segredo: string
}

/** Verdadeiro só com assinatura válida. A documentação pede data.id em minúsculas quando alfanumérico. */
export async function assinaturaValida(e: Entrada): Promise<boolean> {
  const a = lerAssinatura(e.xSignature)
  if (!a || !e.segredo) return false
  const ids = [...new Set([e.dataId?.trim() || null, e.dataId?.trim().toLowerCase() || null])]
  for (const id of ids) {
    const esperado = await hmacHex(e.segredo, manifesto(id, e.xRequestId?.trim() || null, a.ts))
    if (iguais(esperado, a.v1)) return true
  }
  return false
}
