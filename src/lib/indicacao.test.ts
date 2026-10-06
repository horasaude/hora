import { afterEach, describe, expect, it } from 'vitest'
import { guardarIndicacao, indicacaoGuardada, lerCodigoIndicacao } from './indicacao'

describe('link de indicação', () => {
  afterEach(() => localStorage.clear())

  it('lê o código do link e recusa formato estranho', () => {
    expect(lerCodigoIndicacao('?ind=ab12cd34')).toBe('AB12CD34')
    expect(lerCodigoIndicacao('?ind=<script>')).toBeNull()
    expect(lerCodigoIndicacao('?utm_source=x')).toBeNull()
  })

  it('guarda por 30 dias', () => {
    guardarIndicacao('?ind=AB12CD34', 0)
    expect(indicacaoGuardada(29 * 86_400_000)).toBe('AB12CD34')
    expect(indicacaoGuardada(31 * 86_400_000)).toBeNull()
  })
})
