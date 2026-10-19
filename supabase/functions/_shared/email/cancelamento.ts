// E-mails do cancelamento pedido pela aluna. Sem Deno: testado no Vitest.
import { escapar, moldura, p, VERDE, primeiroNome, type Base, type Email } from './modelos.ts'

const contato = (whatsapp: string | null) =>
  whatsapp
    ? p(
        `Qualquer dúvida, fale com a gente no <a href="${escapar(whatsapp)}" style="color:${VERDE}">WhatsApp</a>.`,
      )
    : ''

/** Dentro dos 7 dias: estorno integral. */
export function reembolsoFeito(d: Base & { estornado: boolean }): Email {
  const prazo = d.estornado
    ? 'Já pedimos o estorno integral. No cartão, o valor volta na fatura em até duas faturas, conforme o seu banco; no Pix, volta para a conta que pagou.'
    : 'Recebemos o seu pedido dentro do prazo de 7 dias. A nossa equipe vai fazer o estorno integral e te avisa por aqui.'
  const corpo = [
    p(`Oi, ${primeiroNome(d.nome)}. O cancelamento da sua inscrição no ORA foi feito.`),
    p(prazo),
    p('O seu acesso à plataforma foi encerrado. Se mudar de ideia, as portas continuam abertas.'),
    contato(d.whatsapp),
  ].join('')
  return { assunto: 'Seu cancelamento no ORA', html: moldura(d.site, 'Cancelamento feito', corpo) }
}

/** Depois dos 7 dias: o plano segue até o fim e não é renovado. */
export function naoRenovar(d: Base & { fim: string }): Email {
  const corpo = [
    p(`Oi, ${primeiroNome(d.nome)}. Recebemos o seu pedido de cancelamento.`),
    p(
      `Como já passaram os 7 dias da compra, o seu plano segue normalmente, com acesso até ${escapar(d.fim)}. Depois dessa data a inscrição termina e não é renovada.`,
    ),
    contato(d.whatsapp),
  ].join('')
  return {
    assunto: 'Seu pedido de cancelamento no ORA',
    html: moldura(d.site, 'Pedido recebido', corpo),
  }
}
