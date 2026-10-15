// Texto do lembrete da live (testável no Vitest).

/** "19h" ou "19h30" no horário de Brasília. */
export function horaBrasilia(iso: string): string {
  const d = new Date(new Date(iso).getTime() - 3 * 3_600_000)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`
}

export function mensagemLive(tema: string, data: string) {
  return {
    title: `Live às ${horaBrasilia(data)}: ${tema}`,
    body: 'Começa em 1 hora. A sala abre em Lives 30 minutos antes.',
    url: '/app/lives',
    tag: 'lembrete-live',
  }
}
