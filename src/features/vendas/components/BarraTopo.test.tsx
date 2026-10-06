import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { BarraTopo } from './BarraTopo'

describe('BarraTopo', () => {
  afterEach(() => {
    cleanup()
    window.scrollY = 0
  })

  it('fica escondida no topo e aparece depois de rolar o vídeo', () => {
    render(<BarraTopo />)
    const link = screen.getByRole('link', { name: 'Ver planos' })
    expect(link).toHaveAttribute('tabindex', '-1')
    act(() => {
      window.scrollY = window.innerHeight
      window.dispatchEvent(new Event('scroll'))
    })
    expect(link).toHaveAttribute('tabindex', '0')
    expect(link).toHaveAttribute('href', '#preco')
  })
})
