import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { salvarInscricao } from '../inscricao'
import { CheckoutPage } from './CheckoutPage'

const PEDIDO = '11111111-2222-3333-4444-555555555555'

function abrir(plano: 'pix' | 'parcelado', resposta: unknown) {
  salvarInscricao({ plano, nome: 'Maria Silva', email: 'maria@teste.com', whatsapp: '98987654321' })
  const chamadas: unknown[] = []
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit) => {
      chamadas.push(JSON.parse(String(init.body)))
      return new Response(JSON.stringify(resposta))
    }),
  )
  render(<CheckoutPage />)
  fireEvent.input(screen.getByLabelText('CPF'), { target: { value: '52998224725' } })
  return chamadas
}

describe('pagamento no checkout', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    sessionStorage.clear()
  })

  it('Pix mostra QR, botão de copiar, contagem e o aviso do e-mail', async () => {
    const chamadas = abrir('pix', {
      ok: true,
      pedido: PEDIDO,
      status: 'pendente',
      pix: {
        copia_cola: '000201pix',
        qr_base64: 'AAAA',
        expira_em: new Date(Date.now() + 1_800_000).toISOString(),
      },
    })
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByRole('img', { name: 'QR Code do Pix' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copiar código Pix' })).toBeInTheDocument()
    expect(screen.getByText(/O código expira em (30:00|29:5\d)/)).toBeInTheDocument()
    expect(
      screen.getByText('Assim que o pagamento cair, seu acesso chega no e-mail'),
    ).toBeInTheDocument()
    expect(chamadas[0]).toMatchObject({ acao: 'criar', plano: 'pix', cpf: '52998224725' })
    expect(chamadas[0]).not.toHaveProperty('valor')
  })

  it('cartão vai para a página segura do Asaas, sem dado de cartão no pedido', async () => {
    const assign = vi.fn()
    vi.stubGlobal('location', { ...window.location, assign })
    const chamadas = abrir('parcelado', {
      ok: true,
      pedido: PEDIDO,
      status: 'pendente',
      pagar_url: 'https://www.asaas.com/i/abc123',
    })
    expect(screen.getByText(/página segura do Asaas/)).toBeInTheDocument()
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    await vi.waitFor(() => expect(assign).toHaveBeenCalledWith('https://www.asaas.com/i/abc123'))
    expect(chamadas[0]).toMatchObject({ plano: 'parcelado' })
    expect(chamadas[0]).not.toHaveProperty('cartao')
  })

  it('CPF recusado pelo Asaas pede para conferir os dados', async () => {
    abrir('parcelado', { ok: false, pedido: PEDIDO, erro: 'dados' })
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Confira o CPF')
  })

  it('falha de comunicação vira aviso em português, sem termo técnico', async () => {
    abrir('pix', { ok: false, erro: 'falha' })
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Tente de novo em instantes')
  })
})
