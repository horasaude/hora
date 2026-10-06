import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { PorDentroDoApp } from './PorDentroDoApp'

describe('PorDentroDoApp', () => {
  afterEach(cleanup)

  it('começa na tela Hoje e marcar um hábito soma os pontos', () => {
    render(<PorDentroDoApp />)
    expect(screen.getByText('340 pts')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Treino do dia/ }))
    expect(screen.getByText('350 pts')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Treino do dia/ }))
    expect(screen.getByText('340 pts')).toBeInTheDocument()
  })

  it('trocar de aba mostra a tela certa e a explicação', () => {
    render(<PorDentroDoApp />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Ranking' })[0]!)
    expect(screen.getByText('Ranking do mês')).toBeInTheDocument()
    expect(screen.getByText(/nunca por peso/)).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Plano' })[0]!)
    fireEvent.click(screen.getByRole('button', { name: 'Treino' }))
    expect(screen.getByText('Treino em casa · 25 min')).toBeInTheDocument()
  })
})
