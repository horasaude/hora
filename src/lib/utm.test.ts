import { beforeEach, describe, expect, it } from 'vitest'
import { guardarUtms, lerUtms, utmsGuardadas } from './utm'

describe('utm', () => {
  beforeEach(() => sessionStorage.clear())

  it('lê só as UTMs conhecidas e ignora vazias', () => {
    expect(lerUtms('?utm_source=instagram&utm_medium=&utm_campaign=ora&fbclid=x')).toEqual({
      source: 'instagram',
      campaign: 'ora',
    })
  })

  it('guarda na sessão e devolve depois', () => {
    guardarUtms('?utm_source=meta&utm_content=video1')
    expect(utmsGuardadas()).toEqual({ source: 'meta', content: 'video1' })
  })

  it('entrar de novo sem UTM não apaga as que já estavam', () => {
    guardarUtms('?utm_source=meta')
    guardarUtms('')
    expect(utmsGuardadas()).toEqual({ source: 'meta' })
  })

  it('sessão vazia ou corrompida devolve vazio', () => {
    expect(utmsGuardadas()).toEqual({})
    sessionStorage.setItem('ora:utm', '{quebrado')
    expect(utmsGuardadas()).toEqual({})
  })
})
