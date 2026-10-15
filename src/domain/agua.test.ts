import { describe, expect, it } from 'vitest'
import { metaAguaValida } from './agua'

describe('metaAguaValida', () => {
  it('aceita de 500 a 6.000 ml inteiros', () => {
    expect(metaAguaValida('3000')).toBe(true)
    expect(metaAguaValida('499')).toBe(false)
    expect(metaAguaValida('6001')).toBe(false)
    expect(metaAguaValida('2500.5')).toBe(false)
  })
})
