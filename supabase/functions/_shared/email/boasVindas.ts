// E-mail de pagamento confirmado com o acesso: resumo da compra, endereço da plataforma, usuário,
// botão para criar a senha (24 h) e como instalar o ORA no celular. Sem Deno: testado no Vitest.
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

export type Compra = {
  plano: 'pix' | 'parcelado' | 'recorrente'
  valorCentavos: number
  parcelas: number
  meses: number
}

const reais = (centavos: number) =>
  (centavos / 100)
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    .replace(/\s/g, ' ')

export function textoDaCompra(c: Compra): string {
  if (c.plano === 'pix') return `${reais(c.valorCentavos)} à vista no Pix`
  if (c.plano === 'parcelado')
    return `${c.parcelas}x de ${reais(c.valorCentavos / c.parcelas)} no cartão`
  return `${reais(c.valorCentavos)} por mês, no cartão`
}

const quadro = (titulo: string, linhas: string[]) =>
  `<div style="margin:0 0 20px;padding:16px 18px;background:#f5f3ee;border-radius:14px">
<p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:${VERDE};text-transform:uppercase;letter-spacing:1px">${titulo}</p>
${linhas.map((l) => `<p style="margin:0 0 6px;font-size:15px;line-height:1.5;color:${TINTA}">${l}</p>`).join('')}
</div>`

const passos = (titulo: string, itens: string[]) =>
  `<p style="margin:16px 0 6px;font-size:15px;font-weight:bold;color:${TINTA}">${titulo}</p>
<ol style="margin:0 0 8px;padding-left:20px;font-size:15px;line-height:1.6;color:${TINTA}">${itens.map((i) => `<li>${i}</li>`).join('')}</ol>`

function instalar(endereco: string): string {
  return [
    `<h2 style="margin:28px 0 8px;font-size:18px;color:${VERDE}">Instale o ORA no seu celular</h2>`,
    p('Depois de criar a senha, deixe o ORA na tela do celular, como um aplicativo:'),
    passos('No iPhone', [
      `Abra <strong>${endereco}</strong> no Safari.`,
      'Toque no botão Compartilhar (o quadrado com a seta para cima).',
      'Toque em <strong>Adicionar à Tela de Início</strong> e depois em Adicionar.',
    ]),
    passos('No Android', [
      `Abra <strong>${endereco}</strong> no Chrome.`,
      'Toque nos três pontinhos no canto de cima.',
      'Toque em <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.',
    ]),
    p('Pronto: o ícone do ORA fica na sua tela e abre direto na sua área.'),
  ].join('')
}

type Dados = Base & { email: string; link: string; compra: Compra }

export function boasVindas(d: Dados): Email {
  const endereco = escapar(`${d.site.replace(/^https?:\/\//, '')}/app`)
  const contato = d.whatsapp
    ? `Se o link vencer ou ficar alguma dúvida, fale com a gente no <a href="${escapar(d.whatsapp)}" style="color:${VERDE}">WhatsApp</a>.`
    : 'Se o link vencer, responda este e-mail que mandamos outro.'
  const corpo = [
    p(
      `Oi, ${primeiroNome(d.nome)}! Recebemos o seu pagamento e o seu acesso ao ORA já está liberado.`,
    ),
    quadro('Seu pagamento', [
      'Comunidade ORA',
      escapar(textoDaCompra(d.compra)),
      `${d.compra.meses} meses de acesso`,
    ]),
    quadro('Seu acesso', [
      `Plataforma: <a href="${escapar(d.site)}/app" style="color:${VERDE};font-weight:bold">${endereco}</a>`,
      `Usuário: <strong>${escapar(d.email)}</strong>`,
      'Senha: você cria agora, no botão abaixo. O link vale por 24 horas.',
    ]),
    botao('Criar minha senha', d.link),
    instalar(endereco),
    `<h2 style="margin:28px 0 8px;font-size:18px;color:${VERDE}">Seus primeiros 7 dias</h2>`,
    p(
      'Você começa pela Preparação: uma aula nova por dia, o check-in diário e os primeiros desafios. No dia 8 você escolhe o seu tema e começa a sua trilha.',
    ),
    p(contato),
  ].join('')
  return {
    assunto: 'Pagamento confirmado: seu acesso ao ORA está liberado',
    html: moldura(d.site, 'Pagamento confirmado', corpo),
  }
}
