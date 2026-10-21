import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  assinarEstado,
  CONFIG_SALA,
  criarSala,
  RETORNO,
  semWorkspace,
  urlAutorizacao,
  validarEstado,
} from './google.ts'

const segredo = 'segredo-de-teste'
const agora = 1_800_000_000_000

describe('conexão com o Google', () => {
  it('aceita o estado que o painel gerou, de quem pediu', async () => {
    const estado = await assinarEstado('perfil-1', segredo, agora)
    expect(await validarEstado(estado, segredo, agora + 60_000)).toBe('perfil-1')
  })

  it('recusa estado vencido, adulterado ou de outro segredo', async () => {
    const estado = await assinarEstado('perfil-1', segredo, agora)
    expect(await validarEstado(estado, segredo, agora + 16 * 60_000)).toBeNull()
    expect(await validarEstado(estado.replace('perfil-1', 'perfil-2'), segredo, agora)).toBeNull()
    expect(await validarEstado(estado, 'outro', agora)).toBeNull()
    expect(await validarEstado('lixo', segredo, agora)).toBeNull()
  })

  it('pede acesso offline só para criar salas do Meet', () => {
    const u = new URL(urlAutorizacao('e', 'cliente-1'))
    expect(u.searchParams.get('redirect_uri')).toBe(RETORNO)
    expect(u.searchParams.get('access_type')).toBe('offline')
    expect(u.searchParams.get('scope')).toContain('meetings.space.created')
    expect(u.searchParams.get('scope')).not.toContain('calendar')
  })

  it('cria a sala restrita: link repassado pede para participar', () => {
    expect(CONFIG_SALA.config.accessType).toBe('RESTRICTED')
  })
})

const resposta = (status: number, corpo: unknown) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } })

describe('sala do Meet sem Workspace', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('reconhece a recusa do Google para conta sem Workspace', () => {
    expect(semWorkspace(new Error('meet 403 updateAccessType is not available to the user.'))).toBe(
      true,
    )
    expect(semWorkspace(new Error('meet 401 invalid'))).toBe(false)
  })

  it('Gmail comum: tenta a restrita e cria a sala comum', async () => {
    const chamadas: unknown[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_u: string, init: { body: string }) => {
        chamadas.push(JSON.parse(init.body))
        return chamadas.length === 1
          ? resposta(403, { error: { message: 'updateAccessType is not available to the user.' } })
          : resposta(200, { name: 'spaces/abc', meetingUri: 'https://meet.google.com/abc' })
      }),
    )
    expect(await criarSala('token')).toEqual({
      name: 'spaces/abc',
      meetingUri: 'https://meet.google.com/abc',
    })
    expect(chamadas).toEqual([CONFIG_SALA, {}])
  })

  it('outro erro do Google continua sendo erro', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => resposta(500, { error: { message: 'falhou' } })),
    )
    await expect(criarSala('token')).rejects.toThrow('meet 500')
  })
})
