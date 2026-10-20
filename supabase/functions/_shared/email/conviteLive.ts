// Convite de agenda da live (.ics com METHOD:REQUEST ou CANCEL) e o e-mail que leva o convite.
// O convite leva para Lives no ORA, nunca o link da sala. Sem Deno: testado no Vitest.
import { botao, escapar, moldura, p, primeiroNome, type Email } from './modelos.ts'

export type Convite = {
  live: string
  seq: number
  metodo: 'REQUEST' | 'CANCEL'
  tema: string
  inicio: Date
  minutos: number
  para: string
  nome: string | null
  organizador: string
  site: string
}

const carimbo = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
const texto = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, '\\$&')

/** Linha com mais de 75 caracteres continua na próxima, começando com espaço (regra do .ics). */
const dobrar = (linha: string) => linha.match(/.{1,74}/gu)?.join('\r\n ') ?? linha

export function gerarConvite(c: Convite, agora = new Date()): string {
  const lives = `${c.site}/app/lives`
  const fim = new Date(c.inicio.getTime() + c.minutos * 60_000)
  const nome = c.nome ? `;CN=${texto(c.nome)}` : ''
  return [
    'BEGIN:VCALENDAR',
    'PRODID:-//ORA//Lives//PT',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    `METHOD:${c.metodo}`,
    'BEGIN:VEVENT',
    `UID:live-${c.live}@comunidadeora.com.br`,
    `SEQUENCE:${c.seq}`,
    `DTSTAMP:${carimbo(agora)}`,
    `DTSTART:${carimbo(c.inicio)}`,
    `DTEND:${carimbo(fim)}`,
    `SUMMARY:${texto(`Live ORA: ${c.tema}`)}`,
    `DESCRIPTION:${texto(`Na hora da live, entre pelo ORA, em Lives: ${lives}`)}`,
    `LOCATION:${texto(lives)}`,
    `URL:${lives}`,
    `ORGANIZER;CN=ORA:mailto:${c.organizador}`,
    `ATTENDEE${nome};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=FALSE:mailto:${c.para}`,
    `STATUS:${c.metodo === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED'}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${texto(`Live ORA: ${c.tema}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .map(dobrar)
    .join('\r\n')
}

/** "sexta-feira, 24/10 às 19h" no horário de Brasília. */
export function quandoBrasilia(d: Date): string {
  const dia = d.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  })
  const [h, m] = d
    .toLocaleTimeString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
    })
    .split(':')
  return `${dia} às ${Number(h)}h${m === '00' ? '' : m}`
}

export function emailConvite(c: Convite): Email {
  const quando = quandoBrasilia(c.inicio)
  const tema = escapar(c.tema)
  const oi = c.nome ? `Oi, ${primeiroNome(c.nome)}!` : 'Oi!'
  const cancelada = c.metodo === 'CANCEL'
  const titulo = cancelada ? 'Live cancelada' : c.seq > 1 ? 'Live atualizada' : 'Live marcada'
  const corpo = cancelada
    ? [p(`${oi} A live <b>${tema}</b>, de ${quando}, foi cancelada.`), p('Ela sai da sua agenda.')]
    : [
        p(`${oi} A live <b>${tema}</b> é ${quando}, horário de Brasília.`),
        p(
          'O convite vai para a sua agenda, com aviso 1 hora antes. Na hora, entre pelo ORA, em Lives.',
        ),
        botao('Abrir Lives', `${c.site}/app/lives`),
      ]
  return {
    assunto: `${titulo}: ${c.tema}`,
    html: moldura(c.site, titulo, corpo.join('')),
    anexos: [
      {
        nome: 'convite.ics',
        conteudo: gerarConvite(c),
        tipo: `text/calendar; charset=utf-8; method=${c.metodo}`,
      },
    ],
  }
}
