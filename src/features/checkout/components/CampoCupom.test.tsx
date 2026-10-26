import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { CheckoutPage } from '../pages/CheckoutPage'

const normal = (s?: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()
const tem = (t: string) =>
  expect(screen.queryAllByText((_, el) => normal(el?.textContent) === t).length).toBeGreaterThan(0)

function responder(linhas: unknown[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(linhas), { status: 200 })),
  )
}

const aplicar = (codigo: string) => {
  fireEvent.change(screen.getByLabelText('Cupom de desconto'), { target: { value: codigo } })
  fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }))
}

describe('cupom no checkout', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('cupom válido muda o total do plano em que vale', async () => {
    responder([{ codigo: 'ORA10', tipo: 'porcentagem', valor: 10, planos: ['pix'] }])
    render(<CheckoutPage />)
    fireEvent.click(screen.getByRole('radio', { name: /À vista/ }))
    aplicar('ora10')
    await screen.findByText('Cupom ORA10: 10% de desconto')
    tem('TotalR$ 1.707,30')
    fireEvent.click(screen.getByRole('radio', { name: /Parcelado/ }))
    tem('Este cupom não vale para essa forma de pagamento.')
    tem('Total12x de R$ 187,70')
  })

  it('cupom que não existe avisa e não muda o preço', async () => {
    responder([])
    render(<CheckoutPage />)
    aplicar('NADA')
    await screen.findByText('Cupom inválido ou expirado.')
    tem('Total12x de R$ 187,70')
  })
})
