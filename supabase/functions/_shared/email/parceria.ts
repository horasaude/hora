// E-mail da parceira cadastrada pelo painel: acesso de cortesia por N meses, usuário, botão para
// criar a senha (o link não vence) e como instalar o ORA no celular. Sem Deno: testado no Vitest.
import { instalar } from './boasVindas.ts'
import {
  botao,
  escapar,
  moldura,
  p,
  primeiroNome,
  TINTA,
  VERDE,
  type Base,
  type Email,
} from './modelos.ts'

type Dados = Base & { email: string; link: string; meses: number }

const prazo = (meses: number) => (meses === 1 ? '1 mês' : `${meses} meses`)

export function parceria(d: Dados): Email {
  const endereco = escapar(`${d.site.replace(/^https?:\/\//, '')}/app`)
  const contato = d.whatsapp
    ? `Se ficar alguma dúvida, fale com a gente no <a href="${escapar(d.whatsapp)}" style="color:${VERDE}">WhatsApp</a>.`
    : 'Se ficar alguma dúvida, responda este e-mail.'
  const corpo = [
    p(
      `Oi, ${primeiroNome(d.nome)}! Que alegria ter você com a gente. Liberamos o seu acesso ao ORA por ${prazo(d.meses)}, como nossa parceira.`,
    ),
    `<div style="margin:0 0 20px;padding:16px 18px;background:#f5f3ee;border-radius:14px">
<p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:${VERDE};text-transform:uppercase;letter-spacing:1px">Seu acesso</p>
${[
  `Plataforma: <a href="${escapar(d.site)}/app" style="color:${VERDE};font-weight:bold">${endereco}</a>`,
  `Usuário: <strong>${escapar(d.email)}</strong>`,
  'Senha: você cria no botão abaixo.',
]
  .map((l) => `<p style="margin:0 0 6px;font-size:15px;line-height:1.5;color:${TINTA}">${l}</p>`)
  .join('')}
</div>`,
    botao('Criar minha senha', d.link),
    instalar(endereco),
    p(
      'Você começa pela Preparação, com uma aula nova por dia, o check-in e os primeiros desafios. Estamos com você em cada passo.',
    ),
    p(contato),
  ].join('')
  return {
    assunto: 'Seu acesso ao ORA está liberado',
    html: moldura(d.site, 'Bem-vinda ao ORA', corpo),
  }
}
