// Arquivo de agenda (.ics) para "Adicionar à agenda": abre no Google Agenda, Apple e Outlook.

type Evento = {
  uid: string
  titulo: string
  inicio: Date
  fim: Date
  descricao?: string
  url?: string | null
}

const carimbo = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
const escapar = (s: string) =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/[,;]/g, (c) => `\\${c}`)

/** Texto do .ics com um evento (horários em UTC). */
export function gerarIcs(e: Evento, agora = new Date()): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ORA//Lives//PT',
    'BEGIN:VEVENT',
    `UID:${e.uid}@hora`,
    `DTSTAMP:${carimbo(agora)}`,
    `DTSTART:${carimbo(e.inicio)}`,
    `DTEND:${carimbo(e.fim)}`,
    `SUMMARY:${escapar(e.titulo)}`,
    ...(e.descricao ? [`DESCRIPTION:${escapar(e.descricao)}`] : []),
    ...(e.url ? [`URL:${e.url}`] : []),
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapar(e.titulo)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

/** Baixa o .ics no navegador. */
export function baixarIcs(nome: string, conteudo: string) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${nome}.ics`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
