import { afterEach, describe, expect, it, vi } from 'vitest'
import { eventoMeta, PIXEL_META, recusarCookies } from './pixelMeta'

describe('pixelMeta', () => {
  afterEach(() => {
    localStorage.clear()
    delete window.fbq
    document.head.innerHTML = ''
  })

  it('carrega o pixel da ORA e manda o evento com o id para não contar em dobro', () => {
    eventoMeta('Purchase', { value: 1897, currency: 'BRL' }, 'pedido-1')
    const fila = window.fbq?.queue as unknown[][]
    expect(fila[0]).toEqual(['init', PIXEL_META])
    expect(fila[1]).toEqual([
      'track',
      'Purchase',
      { value: 1897, currency: 'BRL' },
      { eventID: 'pedido-1' },
    ])
    expect(document.head.querySelector('script')?.getAttribute('src')).toContain('fbevents.js')
  })

  it('quem recusou os cookies não manda nada', () => {
    recusarCookies()
    const espia = vi.fn()
    eventoMeta('PageView')
    expect(window.fbq).toBeUndefined()
    expect(espia).not.toHaveBeenCalled()
  })
})
