// Envio único de e-mail do ORA, pelo SMTP do Google Workspace (smtp.gmail.com, porta 465).
// SMTP_USUARIO (a caixa do Workspace), SMTP_SENHA (senha de app dessa caixa) e EMAIL_REMETENTE são secrets.
// O remetente tem que ser a própria caixa ou um alias dela. EMAIL_TESTE desvia todo envio para esse endereço.
import nodemailer from 'npm:nodemailer@6.9.16'
import type { Email } from './modelos.ts'

export async function enviarEmail(para: string, email: Email, chave?: string): Promise<boolean> {
  const usuario = Deno.env.get('SMTP_USUARIO') ?? ''
  const senha = Deno.env.get('SMTP_SENHA') ?? ''
  if (!usuario || !senha) return false
  const teste = (Deno.env.get('EMAIL_TESTE') ?? '').trim()
  const destino = teste || para
  const remetente = Deno.env.get('EMAIL_REMETENTE') ?? `ORA <${usuario}>`
  const assunto = teste && teste !== para ? `[teste para ${para}] ${email.assunto}` : email.assunto
  const transporte = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: usuario, pass: senha },
  })
  try {
    await transporte.sendMail({
      from: remetente,
      to: destino,
      subject: assunto,
      html: email.html,
      ...(chave ? { messageId: `<${chave}@comunidadeora.com.br>` } : {}),
      attachments: email.anexos?.map((a) => ({
        filename: a.nome,
        content: a.conteudo,
        contentType: a.tipo,
      })),
    })
    return true
  } catch (e) {
    console.error('enviarEmail', e instanceof Error ? e.message : e)
    return false
  } finally {
    transporte.close()
  }
}
