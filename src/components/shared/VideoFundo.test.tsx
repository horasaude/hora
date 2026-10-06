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

const ativo = (c: HTMLElement) => c.querySelector<HTMLVideoElement>('video[data-ativo]')!
const fonte = (c: HTMLElement) => ativo(c).getAttribute('src')

describe('VideoFundo', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('corta cada vídeo em 6 segundos e segue a ordem corrida, academia, salada, refeição', () => {
    telaEmPe()
    const { container } = render(<VideoFundo className="" />)
    expect(fonte(container)).toBe('/videos/corrida.mp4')
    const montados = [...container.querySelectorAll('video')].map((v) => v.getAttribute('src'))
    expect(montados).toContain('/videos/academia.mp4')
    const passar = (s: number) => {
      const v = ativo(container)
      Object.defineProperty(v, 'currentTime', { value: s, configurable: true })
      fireEvent.timeUpdate(v)
    }
    passar(3)
    expect(fonte(container)).toBe('/videos/corrida.mp4')
    passar(6)
    expect(fonte(container)).toBe('/videos/academia.mp4')
    fireEvent.ended(ativo(container))
    expect(fonte(container)).toBe('/videos/salada.mp4')
    passar(6.1)
    expect(fonte(container)).toBe('/videos/refeicao.mp4')
    passar(7)
    expect(fonte(container)).toBe('/videos/corrida.mp4')
  })

  it('sem matchMedia (ou com menos movimento), mostra só a imagem', () => {
    vi.stubGlobal('matchMedia', undefined)
    const { container } = render(<VideoFundo className="" />)
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('img')).toHaveAttribute('src', '/videos/corrida.webp')
  })
})
