import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { FIM_OFERTA_ORA, INICIO_OFERTA_ORA } from '@/domain/oferta'
import { VendasPage } from './VendasPage'

function abrirEm(instante: number) {
  vi.useFakeTimers({ now: instante, toFake: ['Date'] })
  render(<VendasPage />)
}

const normal = (s?: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()
const achar = (t: string) => screen.queryAllByText((_, el) => normal(el?.textContent) === t)
const tem = (t: string) => expect(achar(t).length).toBeGreaterThan(0)
const naoTem = (t: string) => expect(achar(t)).toHaveLength(0)

describe('VendasPage', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('na oferta: aviso com contagem no preço, três planos com o normal riscado e o 13º mês', () => {
    abrirEm(FIM_OFERTA_ORA.getTime() - 60_000)
    tem('Oferta ORA: R$ 300 OFF')
    tem('É só hoje, até as 23h59.')
    tem('Termina em')
    expect(screen.getByRole('timer')).toBeInTheDocument()
    tem('12x R$ 198')
    tem('R$ 1.997')
    tem('12x R$ 215')
    tem('de 12x R$ 227')
    tem('de R$ 2.297')
    tem('de 12x R$ 247')
    tem('Compre 12 meses e ganhe 1 mês grátis')
    expect(screen.getAllByText('12 meses + 1 mês grátis')).toHaveLength(3)
    expect(screen.getAllByText('+1 mês grátis')).toHaveLength(3)
    expect(screen.getAllByRole('button', { name: 'Quero este' })).toHaveLength(3)
    expect(screen.getByText('13º mês de acesso grátis')).toBeInTheDocument()
    expect(screen.getByText('Garantia de 7 dias')).toBeInTheDocument()
  })

  it('antes do dia 24/10: preço cheio, aviso da oferta e contagem até começar', () => {
    abrirEm(INICIO_OFERTA_ORA.getTime() - 3 * 86_400_000)
    tem('Só no dia 24/10, no evento ORA.')
    tem('Começa em')
    expect(screen.getByRole('timer')).toBeInTheDocument()
    tem('12x R$ 227')
    tem('R$ 2.297')
    naoTem('de R$ 2.297')
    expect(screen.getAllByText('12 meses de acesso')).toHaveLength(3)
    expect(screen.queryByText('+1 mês grátis')).not.toBeInTheDocument()
    expect(screen.queryByText('13º mês de acesso grátis')).not.toBeInTheDocument()
  })

  it('depois do prazo: preços cheios sem riscado, sem contagem e sem o 13º mês', () => {
    abrirEm(FIM_OFERTA_ORA.getTime() + 1000)
    expect(screen.queryByRole('timer')).not.toBeInTheDocument()
    naoTem('Oferta ORA: R$ 300 OFF')
    naoTem('de R$ 2.297')
    tem('12x R$ 227')
    tem('R$ 2.297')
    tem('12x R$ 247')
    expect(screen.getAllByText('12 meses de acesso')).toHaveLength(3)
    expect(screen.queryByText('+1 mês grátis')).not.toBeInTheDocument()
    naoTem('Compre 12 meses e ganhe 1 mês grátis')
    expect(screen.queryByText('13º mês de acesso grátis')).not.toBeInTheDocument()
  })

  it('sem faixa no topo, sem ranking, sem contrato e sem depoimentos vazios', () => {
    abrirEm(FIM_OFERTA_ORA.getTime() - 60_000)
    expect(screen.queryByRole('button', { name: 'Quero' })).not.toBeInTheDocument()
    expect(screen.queryByText(/prêmios do ranking/i)).not.toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/aceito o contrato/i)
    expect(screen.queryByText(/Quem já/)).not.toBeInTheDocument()
    expect(screen.queryByText(/loja parceira/)).not.toBeInTheDocument()
  })
})
