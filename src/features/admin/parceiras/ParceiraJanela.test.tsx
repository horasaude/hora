import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ParceiraJanela } from './ParceiraJanela'

const invoke = vi.hoisted(() => vi.fn())
vi.mock('@/lib/supabase', () => ({ supabase: { functions: { invoke } } }))

function abrir() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ParceiraJanela aoFechar={() => {}} />
    </QueryClientProvider>,
  )
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: ' Bia Lima ' } })
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'BIA@Teste.com' } })
}

describe('Cadastrar parceira', () => {
  beforeEach(() => invoke.mockReset())
  afterEach(cleanup)

  it('manda nome, e-mail e o prazo escolhido e avisa que o e-mail saiu', async () => {
    invoke.mockResolvedValue({ data: { ok: true, enviado: true }, error: null })
    abrir()
    fireEvent.click(screen.getByRole('button', { name: '3 meses' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar e enviar e-mail' }))
    expect(await screen.findByText(/Enviamos o e-mail para bia@teste.com/)).toBeInTheDocument()
    expect(invoke).toHaveBeenCalledWith('cadastrar-parceira', {
      body: { acao: 'cadastrar', nome: 'Bia Lima', email: 'bia@teste.com', meses: 3 },
    })
  })

  it('12 meses já vem marcado e e-mail errado não chama o servidor', () => {
    abrir()
    expect(screen.getByRole('button', { name: '12 meses' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'sem-arroba' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar e enviar e-mail' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Confira o e-mail')
    expect(invoke).not.toHaveBeenCalled()
  })
})
