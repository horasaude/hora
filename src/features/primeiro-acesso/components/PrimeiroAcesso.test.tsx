import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PrimeiroAcesso } from './PrimeiroAcesso'

const mutate = vi.fn()
vi.mock('../hooks/useSalvarPrimeiroAcesso', () => ({
  useSalvarPrimeiroAcesso: () => ({ mutate, isPending: false, isError: false }),
}))

describe('PrimeiroAcesso', () => {
  afterEach(cleanup)

  it('boas-vindas, apelido e aceite, uma coisa por tela; só salva com aceite', () => {
    render(
      <MemoryRouter>
        <PrimeiroAcesso />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Boas-vindas à ORA' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    const continuar = screen.getByRole('button', { name: 'Continuar' })
    expect(continuar).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Apelido'), { target: { value: 'mari' } })
    fireEvent.click(continuar)
    expect(screen.getByRole('heading', { name: 'Seus dados de saúde' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled()
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(mutate).toHaveBeenCalledWith('mari')
  })
})
