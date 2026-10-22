// Salas do Meet da ORA (API do Meet v2) com o token da conta conectada (google.ts).

/**
 * Sala restrita: só quem é membro (equipe, convidadas e a aluna que entrou pelo ORA) entra direto;
 * link repassado cai no "Pedir para participar".
 */
export const CONFIG_SALA = { config: { accessType: 'RESTRICTED', entryPointAccess: 'ALL' } }

/** Sala restrita que começa a gravar sozinha quando a reunião começa (vai para o Drive da conta). */
export const CONFIG_GRAVANDO = {
  config: {
    ...CONFIG_SALA.config,
    artifactConfig: { recordingConfig: { autoRecordingGeneration: 'ON' } },
  },
}
const MASCARA_GRAVANDO =
  'config.accessType,config.artifactConfig.recordingConfig.autoRecordingGeneration'

export type Sala = { name: string; meetingUri: string }

/** Conta Google sem Workspace (Gmail comum) não pode restringir a sala: o Google responde 403. */
export const semWorkspace = (erro: unknown) =>
  erro instanceof Error && /^meet 403\b/.test(erro.message) && /not available/i.test(erro.message)

async function postarSala(acesso: string, corpo: unknown): Promise<Sala> {
  const r = await fetch('https://meet.googleapis.com/v2/spaces', {
    method: 'POST',
    headers: { Authorization: `Bearer ${acesso}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  })
  const j = (await r.json().catch(() => ({}))) as Partial<Sala> & { error?: { message?: string } }
  if (!r.ok || !j.name || !j.meetingUri)
    throw new Error(`meet ${r.status} ${j.error?.message ?? ''}`.trim())
  return { name: j.name, meetingUri: j.meetingUri }
}

/** Cria a sala restrita gravando; se o Google não aceitar a gravação, restrita sem gravar; sem Workspace, comum. */
export async function criarSala(acesso: string): Promise<Sala> {
  try {
    return await postarSala(acesso, CONFIG_GRAVANDO)
  } catch (e) {
    console.error('sala sem gravação automática', e instanceof Error ? e.message : e)
  }
  try {
    return await postarSala(acesso, CONFIG_SALA)
  } catch (e) {
    if (!semWorkspace(e)) throw e
    return postarSala(acesso, {})
  }
}

const MEET = 'https://meet.googleapis.com/v2'

async function chamarMeet(acesso: string, caminho: string, metodo: string, corpo: unknown) {
  const r = await fetch(`${MEET}/${caminho}`, {
    method: metodo,
    headers: { Authorization: `Bearer ${acesso}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  })
  if (r.ok || r.status === 409) return
  const j = (await r.json().catch(() => ({}))) as { error?: { message?: string } }
  throw new Error(`meet ${r.status} ${j.error?.message ?? ''}`.trim())
}

/** Deixa uma sala que já existe restrita; sem Workspace o Google não deixa e a sala segue como está. */
export async function ajustarSala(acesso: string, sala: string) {
  try {
    return await chamarMeet(
      acesso,
      `${sala}?updateMask=${MASCARA_GRAVANDO}`,
      'PATCH',
      CONFIG_GRAVANDO,
    )
  } catch (e) {
    console.error('sala sem gravação automática', e instanceof Error ? e.message : e)
  }
  try {
    await chamarMeet(acesso, `${sala}?updateMask=config.accessType`, 'PATCH', CONFIG_SALA)
  } catch (e) {
    if (!semWorkspace(e)) throw e
  }
}

/** Membro entra sem pedir; coanfitriã também aceita quem pedir para entrar. Já membro: segue. */
export const adicionarMembro = (acesso: string, sala: string, email: string, coanfitria = false) =>
  chamarMeet(acesso, `${sala}/members`, 'POST', coanfitria ? { email, role: 'COHOST' } : { email })
