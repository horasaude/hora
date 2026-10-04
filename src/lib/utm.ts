export type Utms = {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
}

const CHAVES = ['source', 'medium', 'campaign', 'content', 'term'] as const
const ARMAZEM = 'hora:utm'

export function lerUtms(busca: string): Utms {
  const params = new URLSearchParams(busca)
  const utms: Utms = {}
  for (const chave of CHAVES) {
    const valor = params.get(`utm_${chave}`)?.trim()
    if (valor) utms[chave] = valor.slice(0, 200)
  }
  return utms
}

/** Guarda as UTMs da URL de entrada na sessão. Sem UTM na URL, mantém as que já estavam. */
export function guardarUtms(busca: string): void {
  const utms = lerUtms(busca)
  if (!Object.keys(utms).length) return
  try {
    sessionStorage.setItem(ARMAZEM, JSON.stringify(utms))
  } catch {
    // navegação privada pode bloquear o armazenamento; segue sem UTM
  }
}

export function utmsGuardadas(): Utms {
  try {
    const salvo: unknown = JSON.parse(sessionStorage.getItem(ARMAZEM) ?? '{}')
    if (typeof salvo !== 'object' || salvo === null) return {}
    const utms: Utms = {}
    for (const chave of CHAVES) {
      const valor = (salvo as Record<string, unknown>)[chave]
      if (typeof valor === 'string' && valor) utms[chave] = valor.slice(0, 200)
    }
    return utms
  } catch {
    return {}
  }
}
