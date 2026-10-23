import { afterEach, describe, expect, it } from 'vitest'
import { GA4 } from './googleAnalytics'
import { eventoMeta, recusarCookies } from './pixelMeta'

const eventos = () =>
  (window.dataLayer ?? [])
    .map((a) => Array.from(a as ArrayLike<unknown>))
    .filter((a) => a[0] === 'event')

describe('googleAnalytics', () => {
  afterEach(() => {
    localStorage.clear()
    delete window.fbq
    delete window.gtag
    delete window.dataLayer
    document.head.innerHTML = ''
  })

  it('a compra vai ao Google com o id do pedido e a visita sem o endereço completo', () => {
    window.history.replaceState(null, '', '/obrigada?pedido=abc')
    eventoMeta('PageView')
    eventoMeta('Purchase', { value: 1897, currency: 'BRL' }, 'pedido-1')
    const [visita, compra] = eventos()
    expect(visita).toBeDefined()
    expect(visita![1]).toBe('page_view')
    expect(String((visita![2] as { page_location: string }).page_location)).not.toContain('pedido')
    expect(compra).toEqual([
      'event',
      'purchase',
      { value: 1897, currency: 'BRL', transaction_id: 'pedido-1' },
    ])
    expect(document.head.innerHTML).toContain(`gtag/js?id=${GA4}`)
  })

  it('quem recusou os cookies não manda nada ao Google', () => {
    recusarCookies()
    eventoMeta('Lead')
    expect(window.gtag).toBeUndefined()
  })
})
