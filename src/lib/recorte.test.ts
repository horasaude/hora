import { describe, expect, it } from 'vitest'
import { ENQUADRE_INICIAL, arrastar, retangulo } from './recorte'

describe('recorte', () => {
  it('foto em pé no quadro 16:9 usa a largura toda e centraliza', () => {
    const r = retangulo(900, 1600, 16 / 9, ENQUADRE_INICIAL)
    expect(r.sw).toBe(900)
    expect(r.sh).toBeCloseTo(506.25)
    expect(r.sx).toBe(0)
    expect(r.sy).toBeCloseTo((1600 - 506.25) / 2)
  })

  it('aproximar diminui a parte mostrada', () => {
    const r = retangulo(1600, 900, 16 / 9, { zoom: 2, x: 0, y: 0 })
    expect(r).toEqual({ sx: 0, sy: 0, sw: 800, sh: 450 })
  })

  it('arrastar para baixo mostra mais do topo e para no limite', () => {
    const e = arrastar(900, 1600, 16 / 9, ENQUADRE_INICIAL, 0, 100, 450)
    expect(e.y).toBeLessThan(0.5)
    const fim = arrastar(900, 1600, 16 / 9, ENQUADRE_INICIAL, 0, 100000, 450)
    expect(fim.y).toBe(0)
    expect(fim.x).toBe(0.5)
  })
})
