import { describe, expect, it } from 'vitest'
import type { Session } from '@supabase/supabase-js'
import { linkComErro, sessaoDoLink } from './linkDeSenha'

const sessao = (entrou: string | undefined) => ({ user: { last_sign_in_at: entrou } }) as Session
const agora = new Date('2026-10-13T14:00:00Z').getTime()

describe('link de criar senha', () => {
  it('aceita a sessão que acabou de entrar pelo link', () => {
    expect(sessaoDoLink(sessao('2026-10-13T13:55:00Z'), agora)).toBe(true)
  })

  it('recusa a sessão antiga do navegador (outra conta já logada)', () => {
    expect(sessaoDoLink(sessao('2026-10-07T17:57:41Z'), agora)).toBe(false)
    expect(sessaoDoLink(null, agora)).toBe(false)
    expect(sessaoDoLink(sessao(undefined), agora)).toBe(false)
  })

  it('reconhece o link expirado ou já usado no endereço', () => {
    expect(linkComErro({ hash: '#error=access_denied&error_code=otp_expired', search: '' })).toBe(
      true,
    )
    expect(linkComErro({ hash: '', search: '?error=unauthorized_client' })).toBe(true)
    expect(linkComErro({ hash: '#access_token=abc&type=invite', search: '' })).toBe(false)
  })
})
