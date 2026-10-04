import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FIM_OFERTA_ORA } from '@/domain/oferta'
import { VendasPage } from './VendasPage'

function abrirEm(instante: number) {
  vi.useFakeTimers({ now: instante, toFake: ['Date'] })
  render(
    <MemoryRouter>
      <VendasPage />
    </MemoryRouter>,
  )
}

const texto = (t: string) => screen.getByText((_, el) => el?.textContent?.replace(/\s/g, ' ') === t)

describe('VendasPage', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('na oferta mostra os preços do ORA, 13 meses e a contagem', () => {
    abrirEm(FIM_OFERTA_ORA.getTime() - 60_000)
    expect(texto('R$ 1.997')).toBeInTheDocument()
    expect(texto('12x de R$ 198')).toBeInTheDocument()
    expect(texto('12x de R$ 215')).toBeInTheDocument()
    expect(screen.getByText('13 meses de acesso')).toBeInTheDocument()
    expect(screen.getByRole('timer')).toBeInTheDocument()
  })

  it('depois do prazo mostra os preços cheios e some a contagem', () => {
    abrirEm(FIM_OFERTA_ORA.getTime() + 1000)
    expect(texto('R$ 2.297')).toBeInTheDocument()
    expect(texto('12x de R$ 227')).toBeInTheDocument()
    expect(texto('12x de R$ 247')).toBeInTheDocument()
    expect(screen.getByText('12 meses de acesso')).toBeInTheDocument()
    expect(screen.queryByRole('timer')).not.toBeInTheDocument()
  })
})
