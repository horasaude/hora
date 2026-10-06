import { afterEach, describe, expect, it, vi } from 'vitest'
import { iniciarRevelar } from './revelar'

describe('iniciarRevelar', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('sem IntersectionObserver, mostra tudo na hora', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    document.body.innerHTML = '<div data-revelar></div><div data-revelar></div>'
    iniciarRevelar()
    expect(document.querySelectorAll('.revelado')).toHaveLength(2)
  })

  it('revela quando o elemento entra na tela e para de observar', () => {
    let aviso: (e: { isIntersecting: boolean; target: Element }[]) => void = () => {}
    const unobserve = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: typeof aviso) {
          aviso = cb
        }
        observe() {}
        unobserve = unobserve
        disconnect() {}
      },
    )
    document.body.innerHTML = '<div id="a" data-revelar></div>'
    iniciarRevelar()
    const alvo = document.getElementById('a')!
    aviso([{ isIntersecting: false, target: alvo }])
    expect(alvo).not.toHaveClass('revelado')
    aviso([{ isIntersecting: true, target: alvo }])
    expect(alvo).toHaveClass('revelado')
    expect(unobserve).toHaveBeenCalledWith(alvo)
  })
})
