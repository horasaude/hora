import { describe, expect, it } from 'vitest'
import { prazoDaDuvida } from './forum'

const agora = new Date('2026-10-10T12:00:00Z')
const em = (h: number) => new Date(agora.getTime() + h * 3_600_000)

describe('prazoDaDuvida', () => {
  it('verde com folga', () => {
    expect(prazoDaDuvida(em(72), agora)).toEqual({ tom: 'verde', texto: 'Faltam 3 d' })
    expect(prazoDaDuvida(em(30), agora)).toEqual({ tom: 'verde', texto: 'Faltam 1 d 6 h' })
  })
  it('dourado com menos de 12 horas', () => {
    expect(prazoDaDuvida(em(11.5), agora)).toEqual({ tom: 'dourado', texto: 'Faltam 11 h' })
    expect(prazoDaDuvida(em(0.5), agora)).toEqual({ tom: 'dourado', texto: 'Menos de 1 h' })
  })
  it('coral vencida', () => {
    expect(prazoDaDuvida(em(-5), agora)).toEqual({ tom: 'coral', texto: 'Vencida há 5 h' })
    expect(prazoDaDuvida(em(-0.2), agora)).toEqual({ tom: 'coral', texto: 'Venceu agora' })
  })
})
