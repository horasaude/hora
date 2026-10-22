// Gravação da live: quando a reunião acaba, o Meet salva o vídeo no Drive da conta conectada.
// Aqui achamos o arquivo, travamos o download, deixamos visível para quem tem o link e devolvemos o player.
const MEET = 'https://meet.googleapis.com/v2'
const DRIVE = 'https://www.googleapis.com/drive/v3'

export type Gravacao = {
  state?: string
  startTime?: string
  endTime?: string
  driveDestination?: { file?: string }
}
type Reuniao = { name: string; startTime?: string; endTime?: string }

const duracao = (g: Gravacao) => Date.parse(g.endTime ?? '') - Date.parse(g.startTime ?? '')

/** Entre as gravações prontas, a mais longa (se pararam e voltaram a gravar, fica a principal). */
export function escolherGravacao(lista: Gravacao[]): string | null {
  const prontas = lista
    .filter((g) => g.state === 'FILE_GENERATED' && g.driveDestination?.file)
    .sort((a, b) => duracao(b) - duracao(a))
  return prontas[0]?.driveDestination?.file ?? null
}

/** Reuniões já encerradas que começaram a partir de 1 hora antes da live (ignora testes de outros dias). */
export function reunioesDaLive(lista: Reuniao[], inicio: string): Reuniao[] {
  const desde = Date.parse(inicio) - 60 * 60_000
  return lista.filter((r) => r.endTime && Date.parse(r.startTime ?? '') >= desde)
}

async function google<T>(
  acesso: string,
  url: string,
  corpo?: unknown,
  metodo = 'POST',
): Promise<T> {
  const r = await fetch(url, {
    method: corpo ? metodo : 'GET',
    headers: { Authorization: `Bearer ${acesso}`, 'Content-Type': 'application/json' },
    ...(corpo ? { body: JSON.stringify(corpo) } : {}),
  })
  const j = (await r.json().catch(() => ({}))) as T & { error?: { message?: string } }
  if (!r.ok) throw new Error(`google ${r.status} ${j.error?.message ?? ''}`.trim())
  return j
}

/** Link do player da gravação da sala, ou null se ainda não ficou pronta. */
export async function gravacaoDaSala(acesso: string, sala: string, inicio: string) {
  const filtro = encodeURIComponent(`space.name="${sala}"`)
  const { conferenceRecords = [] } = await google<{ conferenceRecords?: Reuniao[] }>(
    acesso,
    `${MEET}/conferenceRecords?filter=${filtro}`,
  )
  const gravacoes: Gravacao[] = []
  for (const r of reunioesDaLive(conferenceRecords, inicio)) {
    const { recordings = [] } = await google<{ recordings?: Gravacao[] }>(
      acesso,
      `${MEET}/${r.name}/recordings`,
    )
    gravacoes.push(...recordings)
  }
  const arquivo = escolherGravacao(gravacoes)
  if (!arquivo) return null
  // Sem baixar, imprimir nem copiar para quem só assiste; depois abre para quem tem o link.
  await google(
    acesso,
    `${DRIVE}/files/${arquivo}?supportsAllDrives=true`,
    { copyRequiresWriterPermission: true },
    'PATCH',
  )
  await google(acesso, `${DRIVE}/files/${arquivo}/permissions?supportsAllDrives=true`, {
    role: 'reader',
    type: 'anyone',
  })
  return `https://drive.google.com/file/d/${arquivo}/view`
}
