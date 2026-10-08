import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'

const reset = vi.hoisted(() => vi.fn())
vi.mock('@/lib/supabase', () => ({ supabase: { auth: { resetPasswordForEmail: reset } } }))

function abrir() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Esqueci minha senha' }))
}

describe('Esqueci minha senha', () => {
  afterEach(() => {
    cleanup()
    reset.mockReset()
  })

  it('manda o link para criar nova senha e responde igual com ou sem conta', async () => {
    reset.mockResolvedValue({ error: null })
    abrir()
    fireEvent.input(screen.getByLabelText('E-mail'), { target: { value: 'maria@teste.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar link' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Se este e-mail tiver conta no ORA')
    expect(reset).toHaveBeenCalledWith('maria@teste.com', {
      redirectTo: `${window.location.origin}/definir-senha`,
    })
  })

  it('avisa quando há pedidos demais', async () => {
    reset.mockResolvedValue({ error: { status: 429 } })
    abrir()
    fireEvent.input(screen.getByLabelText('E-mail'), { target: { value: 'maria@teste.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar link' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Muitas tentativas')
  })

  it('volta para a tela de entrar', () => {
    abrir()
    fireEvent.click(screen.getByRole('button', { name: 'Voltar para entrar' }))
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })
})
