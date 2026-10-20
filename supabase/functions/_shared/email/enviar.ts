// Envio único de e-mail do ORA, pelo Resend (POST https://api.resend.com/emails).
// RESEND_API_KEY e EMAIL_REMETENTE são secrets. Enquanto não houver domínio verificado no Resend,
// EMAIL_TESTE desvia todo envio para esse endereço (o Resend só entrega para o dono da conta).
import type { Anexo, Email } from './modelos.ts'

const base64 = (texto: string) => {
  const bytes = new TextEncoder().encode(texto)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin)
}

const anexo = (a: Anexo) => ({
  filename: a.nome,
  content: base64(a.conteudo),
  content_type: a.tipo,
})

export async function enviarEmail(para: string, email: Email, chave?: string): Promise<boolean> {
  const api = Deno.env.get('RESEND_API_KEY') ?? ''
  if (!api) return false
  const teste = (Deno.env.get('EMAIL_TESTE') ?? '').trim()
  const destino = teste || para
  const remetente = Deno.env.get('EMAIL_REMETENTE') ?? 'ORA <onboarding@resend.dev>'
  const headers: Record<string, string> = {
    Authorization: `Bearer ${api}`,
    'Content-Type': 'application/json',
  }
  if (chave) headers['Idempotency-Key'] = chave
  const assunto = teste && teste !== para ? `[teste para ${para}] ${email.assunto}` : email.assunto
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      from: remetente,
      to: [destino],
      subject: assunto,
      html: email.html,
      ...(email.anexos?.length ? { attachments: email.anexos.map(anexo) } : {}),
    }),
  })
  return r.ok
}
