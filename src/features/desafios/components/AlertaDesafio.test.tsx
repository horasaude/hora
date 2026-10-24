import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { Desafio } from '../api/desafios.api'
import { AlertaDesafio } from './AlertaDesafio'

const lista: { data: Desafio[] } = { data: [] }
vi.mock('../hooks/useDesafios', () => ({ useDesafios: () => lista }))

const base = {
  id: 'd1',
  nome: 'Água todo dia',
  tema_id: null,
  inicio: '2026-10-20',
  fim: '2026-10-30',
  premio: 'Kit ORA',
  premio_surpresa: false,
  encerrado: false,
  participando: true,
  feito_hoje: false,
} as Desafio

const ver = (d: Desafio) => {
  lista.data = [d]
  return render(
    <MemoryRouter>
      <AlertaDesafio hoje="2026-10-23" />
    </MemoryRouter>,
  )
}

describe('AlertaDesafio', () => {
  afterEach(cleanup)

  it('lembra do check-in de hoje com o prêmio e leva ao desafio', () => {
    ver(base)
    expect(screen.getByText('Falta o seu check-in de hoje')).toBeInTheDocument()
    expect(screen.getByText('Água todo dia · Prêmio: Kit ORA')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Fazer check-in' })).toHaveAttribute(
      'href',
      '/app/desafios/d1',
    )
  })

  it('quem ainda não entrou é chamada para ver o desafio', () => {
    ver({ ...base, participando: false })
    expect(screen.getByText('O desafio do mês já começou')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver desafio' })).toBeInTheDocument()
  })

  it('some depois do check-in de hoje', () => {
    const { container } = ver({ ...base, feito_hoje: true })
    expect(container).toBeEmptyDOMElement()
  })
})
