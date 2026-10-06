import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { VideoFundo } from './VideoFundo'

function telaEmPe() {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: false,
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
}

describe('VideoFundo', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('usa um só vídeo, corta em 6 s e segue corrida, academia, salada, refeição', () => {
    telaEmPe()
    const { container } = render(<VideoFundo className="" />)
    expect(container.querySelectorAll('video')).toHaveLength(1)
    const v = container.querySelector('video')!
    expect(v).toHaveAttribute('muted')
    const passar = (s: number) => {
      Object.defineProperty(v, 'currentTime', { value: s, configurable: true })
      fireEvent.timeUpdate(v)
    }
    expect(v.getAttribute('src')).toBe('/videos/corrida.mp4')
    passar(3)
    expect(v.getAttribute('src')).toBe('/videos/corrida.mp4')
    passar(6)
    expect(v.getAttribute('src')).toBe('/videos/academia.mp4')
    fireEvent.ended(v)
    expect(v.getAttribute('src')).toBe('/videos/salada.mp4')
    passar(6.1)
    expect(v.getAttribute('src')).toBe('/videos/refeicao.mp4')
    passar(7)
    expect(v.getAttribute('src')).toBe('/videos/corrida.mp4')
  })

  it('a imagem do próximo cobre a troca e some quando o vídeo começa', () => {
    telaEmPe()
    const { container } = render(<VideoFundo className="" />)
    const v = container.querySelector('video')!
    expect(container.querySelector('img[data-cobertura]')).not.toBeNull()
    fireEvent.playing(v)
    expect(container.querySelector('img[data-cobertura]')).toBeNull()
    fireEvent.ended(v)
    expect(container.querySelector('img[data-cobertura]')).toHaveAttribute(
      'src',
      '/videos/academia.webp',
    )
  })

  it('sem matchMedia (ou com menos movimento), mostra só a imagem', () => {
    vi.stubGlobal('matchMedia', undefined)
    const { container } = render(<VideoFundo className="" />)
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('img')).toHaveAttribute('src', '/videos/corrida.webp')
  })
})
