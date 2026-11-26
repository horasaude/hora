import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { CheckoutPage } from './CheckoutPage'

vi.mock('../api/cupom.api', () => ({
  consultarCupom: vi.fn(async () => ({
    id: 'c1',
    codigo: 'BLACK87',
    tipo: 'valor',
    valor: 12980,
    planos: ['recorrente'],
  })),
}))

describe('CheckoutPage: cupom de um plano só', () => {
  afterEach(() => {
    cleanup()
    window.history.replaceState(null, '', '/')
  })

  it('link com cupom que só vale no mensal já abre no mensal', { timeout: 10000 }, async () => {
    window.history.replaceState(null, '', '/checkout?cupom=BLACK87')
    render(<CheckoutPage />)
    expect(
      await screen.findByRole('radio', { name: /Mensal/, checked: true }, { timeout: 4000 }),
    ).toBeChecked()
    expect(screen.queryByText('Este cupom não vale para essa forma de pagamento.')).toBeNull()
  })
})
