import { describe, expect, it } from 'vitest'
import { assinarEstado, CONFIG_SALA, RETORNO, urlAutorizacao, validarEstado } from './google.ts'

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
