// Modelos dos e-mails do ORA: HTML simples, fundo branco, Arial, botão verde ORA e rodapé da empresa.
// Sem Deno: testado no Vitest.

const VERDE = '#2c4c44'
const TINTA = '#1f2a27'
const SUAVE = '#5d6b67'

export type Email = { assunto: string; html: string }

export function escapar(texto: string): string {
  return texto
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

const primeiroNome = (nome: string) => escapar(nome.trim().split(/\s+/)[0] ?? '')

const p = (texto: string) =>
  `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${TINTA}">${texto}</p>`

const botao = (rotulo: string, link: string) =>
  `<p style="margin:24px 0"><a href="${escapar(link)}" style="display:inline-block;background:${VERDE};color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 28px;border-radius:999px">${rotulo}</a></p>`

function moldura(site: string, titulo: string, corpo: string): string {
  return `<!doctype html><html lang="pt-BR"><body style="margin:0;padding:0;background:#ffffff">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:Arial,Helvetica,sans-serif;background:#ffffff">
<img src="${escapar(site)}/logo-ora.png" alt="ORA" width="120" style="display:block;width:120px;height:auto;margin-bottom:28px">
<h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;color:${VERDE};font-weight:bold">${titulo}</h1>
${corpo}
<p style="margin:40px 0 0;padding-top:16px;border-top:1px solid #e6e2da;font-size:12px;line-height:1.5;color:${SUAVE}">A &amp; M SAÚDE E BEM ESTAR LTDA</p>
</div></body></html>`
}

type Base = { site: string; nome: string; whatsapp: string | null }

export function boasVindas(d: Base & { link: string }): Email {
  const contato = d.whatsapp
    ? p(
        `Ficou alguma dúvida? Fale com a gente no <a href="${escapar(d.whatsapp)}" style="color:${VERDE}">WhatsApp</a>.`,
      )
    : ''
  const corpo = [
    p(
      `Oi, ${primeiroNome(d.nome)}! Seu pagamento foi confirmado e o seu acesso ao ORA já começou.`,
    ),
    p('Para entrar, crie a sua senha no botão abaixo. O link vale por 24 horas.'),
    botao('Criar minha senha', d.link),
    p(
      '<strong>Nos primeiros 7 dias</strong> você passa pela Preparação: uma aula nova por dia, o check-in diário e os primeiros desafios. No dia 8 você escolhe o seu tema e começa a sua trilha.',
    ),
    contato,
  ].join('')
  return {
    assunto: 'Seu acesso ao ORA está liberado',
    html: moldura(d.site, 'Seu acesso ao ORA está liberado', corpo),
  }
}

export function lembretePix(d: Base & { copiaCola: string; checkout: string }): Email {
  const corpo = [
    p(`Oi, ${primeiroNome(d.nome)}! O seu Pix do ORA ainda não caiu.`),
    p(
      'Se quiser pagar agora, copie o código abaixo e cole no app do seu banco, na opção Pix copia e cola:',
    ),
    `<p style="margin:0 0 16px;padding:12px;background:#f5f3ee;border-radius:12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:${TINTA};word-break:break-all">${escapar(d.copiaCola)}</p>`,
    p(
      'Assim que o pagamento cair, seu acesso chega neste e-mail. Se o código expirar, é só gerar outro no checkout.',
    ),
    botao('Voltar ao checkout', d.checkout),
  ].join('')
  return {
    assunto: 'Seu Pix do ORA está esperando',
    html: moldura(d.site, 'Seu Pix está esperando', corpo),
  }
}

export function cobrancaRecusada(d: Base & { link: string }): Email {
  const contato = d.whatsapp
    ? p(
        `Se preferir, fale com a gente no <a href="${escapar(d.whatsapp)}" style="color:${VERDE}">WhatsApp</a>.`,
      )
    : ''
  const corpo = [
    p(`Oi, ${primeiroNome(d.nome)}! A cobrança deste mês do ORA não passou no seu cartão.`),
    p(
      'Acontece. Pode ser limite, cartão vencido ou um bloqueio do banco. Para não perder o acesso, atualize o cartão nos próximos 7 dias.',
    ),
    botao('Atualizar cartão', d.link),
    contato,
  ].join('')
  return {
    assunto: 'Não conseguimos cobrar a mensalidade do ORA',
    html: moldura(d.site, 'Vamos atualizar o seu cartão?', corpo),
  }
}

/** Link wa.me a partir do número com DDD (com ou sem 55). */
export function linkWhatsApp(numero: string | undefined): string | null {
  const d = (numero ?? '').replace(/\D/g, '')
  if (d.length < 10) return null
  return `https://wa.me/${d.startsWith('55') && d.length > 11 ? d : '55' + d}`
}
