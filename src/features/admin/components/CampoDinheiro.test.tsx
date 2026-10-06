import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModuloVazioPage } from '../pages/ModuloVazioPage'
import { CampoDinheiro } from './CampoDinheiro'

describe('CampoDinheiro', () => {
  afterEach(cleanup)

  it('mostra em reais e devolve centavos ao digitar', () => {
    const aoMudar = vi.fn()
    render(<CampoDinheiro rotulo="Pix à vista" valor={229700} aoMudar={aoMudar} />)
    const campo = screen.getByLabelText('Pix à vista')
    expect(campo).toHaveValue('R$ 2.297,00')
    fireEvent.change(campo, { target: { value: 'R$ 2.297,005' } })
    expect(aoMudar).toHaveBeenCalledWith(2297005)
  })
})

describe('ModuloVazioPage', () => {
  afterEach(cleanup)

  it('mostra cartões zerados e "Nenhum registro ainda" na tabela', () => {
    render(
      <MemoryRouter>
        <ModuloVazioPage modulo="financeiro" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Financeiro' })).toBeInTheDocument()
    expect(screen.getByText('R$ 0')).toBeInTheDocument()
    expect(screen.getByText('Nenhum registro ainda')).toBeInTheDocument()
  })
})
