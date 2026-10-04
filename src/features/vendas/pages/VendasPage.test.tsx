import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { FIM_OFERTA_ORA } from '@/domain/oferta'
import { VendasPage } from './VendasPage'

function abrirEm(instante: number) {
  vi.useFakeTimers({ now: instante, toFake: ['Date'] })
  render(<VendasPage />)
}

const normal = (s?: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()
const texto = (t: string) => screen.getByText((_, el) => normal(el?.textContent) === t)
const semTexto = (t: string) =>
  expect(screen.queryByText((_, el) => normal(el?.textContent) === t)).not.toBeInTheDocument()

describe('VendasPage', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('na oferta: faixa com contagem, preço ancorado, 13 meses e o bônus do 13º mês', () => {
    abrirEm(FIM_OFERTA_ORA.getTime() - 60_000)
    expect(texto('Oferta ORA: R$ 300 OFF até 24/10')).toBeInTheDocument()
    expect(screen.getByRole('timer')).toBeInTheDocument()
    expect(texto('de R$ 2.297')).toBeInTheDocument()
    expect(texto('12x R$ 198')).toBeInTheDocument()
    expect(texto('ou R$ 1.997 no Pix')).toBeInTheDocument()
    expect(texto('ou 12x de R$ 215 no cartão recorrente')).toBeInTheDocument()
    expect(screen.getByText('13 meses de acesso')).toBeInTheDocument()
    expect(screen.getByText('13º mês de acesso grátis')).toBeInTheDocument()
  })

  it('depois do prazo: troca sozinho para os preços cheios e some a faixa', () => {
    abrirEm(FIM_OFERTA_ORA.getTime() + 1000)
    expect(screen.queryByRole('timer')).not.toBeInTheDocument()
    semTexto('de R$ 2.297')
    expect(texto('12x R$ 227')).toBeInTheDocument()
    expect(texto('ou R$ 2.297 no Pix')).toBeInTheDocument()
    expect(texto('ou 12x de R$ 247 no cartão recorrente')).toBeInTheDocument()
    expect(screen.getByText('12 meses de acesso')).toBeInTheDocument()
    expect(screen.queryByText('13º mês de acesso grátis')).not.toBeInTheDocument()
  })

  it('não fala de contrato, esconde depoimentos vazios e a loja parceira desligada', () => {
    abrirEm(FIM_OFERTA_ORA.getTime() - 60_000)
    expect(document.body.textContent).not.toMatch(/aceito o contrato/i)
    expect(screen.queryByText(/Quem já/)).not.toBeInTheDocument()
    expect(screen.queryByText(/loja parceira/)).not.toBeInTheDocument()
  })
})
