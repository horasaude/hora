import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import type { Desafio } from '../api/desafios.api'
import { PremioDesafio } from './PremioDesafio'

const base = { premio: '', premio_surpresa: false, meta_dias: 7 } as Desafio

describe('PremioDesafio', () => {
  afterEach(cleanup)

  it('mostra o prêmio, a caixa surpresa e para quem é', () => {
    render(<PremioDesafio d={{ ...base, premio: 'Kit ORA', premio_surpresa: true }} />)
    expect(screen.getByText('Kit ORA + caixa surpresa')).toBeInTheDocument()
    expect(screen.getByText('Para quem completar os 7 dias')).toBeInTheDocument()
  })

  it('só a caixa surpresa vira o texto do prêmio; sem prêmio, nada aparece', () => {
    const { container, rerender } = render(<PremioDesafio d={{ ...base, premio_surpresa: true }} />)
    expect(screen.getByText('Caixa surpresa')).toBeInTheDocument()
    rerender(<PremioDesafio d={base} />)
    expect(container).toBeEmptyDOMElement()
  })
})
