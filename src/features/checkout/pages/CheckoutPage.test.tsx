import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { FIM_OFERTA_ORA } from '@/domain/oferta'
import { salvarInscricao } from '../inscricao'
import { CheckoutPage } from './CheckoutPage'

const normal = (s?: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()
const tem = (t: string) =>
  expect(screen.queryAllByText((_, el) => normal(el?.textContent) === t).length).toBeGreaterThan(0)

function abrir() {
  vi.useFakeTimers({ now: FIM_OFERTA_ORA.getTime() - 60_000, toFake: ['Date'] })
  render(<CheckoutPage />)
}

const campo = (rotulo: string) => screen.getByLabelText<HTMLInputElement>(rotulo)

describe('CheckoutPage', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    sessionStorage.clear()
  })

  it('chega preenchido com o que a pessoa digitou no popup', () => {
    salvarInscricao({
      plano: 'pix',
      nome: 'Maria Silva',
      email: 'maria@teste.com',
      whatsapp: '98987654321',
    })
    abrir()
    expect(campo('Seu e-mail').value).toBe('maria@teste.com')
    expect(campo('Nome completo').value).toBe('Maria Silva')
    expect(campo('WhatsApp').value).toBe('(98) 98765-4321')
    expect(screen.getByRole('radio', { name: /À vista/ })).toBeChecked()
    tem('Pix')
    tem('Oferta ORA: R$ 300 OFF + 1 mês grátis')
    tem('12 meses + 1 mês grátis')
  })

  it('trocar o plano muda a forma de pagamento e o total', () => {
    abrir()
    expect(screen.getByRole('radio', { name: /Parcelado/ })).toBeChecked()
    tem('Cartão de crédito')
    tem('Total12x de R$ 198')
    fireEvent.click(screen.getByRole('radio', { name: /À vista/ }))
    tem('TotalR$ 1.997')
  })

  it('CPF com máscara; inválido é recusado e, com tudo certo, avisa que o pagamento vem em breve', async () => {
    salvarInscricao({
      plano: 'parcelado',
      nome: 'Maria Silva',
      email: 'maria@teste.com',
      whatsapp: '98987654321',
    })
    abrir()
    fireEvent.input(campo('CPF'), { target: { value: '52998224726' } })
    expect(campo('CPF').value).toBe('529.982.247-26')
    fireEvent.click(screen.getByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByText('Confira o CPF')).toBeInTheDocument()
    fireEvent.input(campo('CPF'), { target: { value: '52998224725' } })
    fireEvent.click(screen.getByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByRole('status')).toHaveTextContent(
      'O pagamento será liberado em breve.',
    )
  })

  it('pede nome completo', async () => {
    salvarInscricao({
      plano: 'pix',
      nome: 'Maria',
      email: 'maria@teste.com',
      whatsapp: '98987654321',
    })
    abrir()
    fireEvent.click(screen.getByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByText('Escreva seu nome completo')).toBeInTheDocument()
  })
})

describe('CheckoutPage: aceite dos termos', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('mostra a linha de termos com links abaixo do botão, sem checkbox', () => {
    abrir()
    expect(screen.getByText(/Ao finalizar, você concorda com os/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Termos de uso' })).toHaveAttribute('href', '/termos')
    expect(screen.getByRole('link', { name: 'Política de privacidade' })).toHaveAttribute(
      'href',
      '/privacidade',
    )
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })
})
