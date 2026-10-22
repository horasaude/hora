// Régua da mensalidade em atraso (3º dia, 6º dia e acesso pausado no 7º). Sem Deno: testado no Vitest.
import {
  botao,
  escapar,
  moldura,
  p,
  primeiroNome,
  VERDE,
  type Base,
  type Email,
} from './modelos.ts'

export type EtapaCobranca = 'lembrete' | 'vespera' | 'pausado'

const contato = (whatsapp: string | null) =>
  whatsapp
    ? p(
        `Se precisar de ajuda, fale com a gente no <a href="${escapar(whatsapp)}" style="color:${VERDE}">WhatsApp</a>.`,
      )
    : ''

type Dados = Base & { link: string; pausaEm: string }

const TEXTOS: Record<
  EtapaCobranca,
  (d: Dados) => { assunto: string; titulo: string; texto: string; botao: string }
> = {
  lembrete: (d) => ({
    assunto: 'Sua mensalidade do ORA continua em aberto',
    titulo: 'Sua mensalidade está em aberto',
    texto: `A mensalidade deste mês ainda não foi paga. Para seguir com acesso a tudo, pague até ${escapar(d.pausaEm)}, no mesmo cartão ou em outro.`,
    botao: 'Pagar a mensalidade',
  }),
  vespera: (d) => ({
    assunto: 'Seu acesso ao ORA será pausado',
    titulo: 'Seu acesso será pausado',
    texto: `A mensalidade continua em aberto e o seu acesso será pausado em ${escapar(d.pausaEm)}. Pagando antes disso, nada muda para você.`,
    botao: 'Pagar agora',
  }),
  pausado: () => ({
    assunto: 'Seu acesso ao ORA foi pausado',
    titulo: 'Seu acesso foi pausado',
    texto:
      'Como a mensalidade não foi paga, o seu acesso à plataforma está pausado. Assim que o pagamento cair, ele volta na hora, com todo o seu progresso.',
    botao: 'Pagar e voltar',
  }),
}

export function emailCobranca(etapa: EtapaCobranca, d: Dados): Email {
  const t = TEXTOS[etapa](d)
  const corpo = [
    p(`Oi, ${primeiroNome(d.nome)}!`),
    p(t.texto),
    botao(t.botao, d.link),
    contato(d.whatsapp),
  ].join('')
  return { assunto: t.assunto, html: moldura(d.site, t.titulo, corpo) }
}
