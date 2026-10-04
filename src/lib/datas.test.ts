import { describe, expect, it } from 'vitest'
import { diaEmBrasilia } from './datas'

describe('diaEmBrasilia', () => {
  it('23h50 em Brasília continua no mesmo dia, mesmo já sendo o dia seguinte em UTC', () => {
    expect(diaEmBrasilia(new Date('2026-10-25T02:50:00Z'))).toBe('2026-10-24')
  })
  it('00h10 em Brasília já é o dia seguinte', () => {
    expect(diaEmBrasilia(new Date('2026-10-25T03:10:00Z'))).toBe('2026-10-25')
  })
})
