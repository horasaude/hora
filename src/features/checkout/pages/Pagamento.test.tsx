import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { salvarInscricao } from '../inscricao'
import { brickFalso } from './brickFalso'
import { CheckoutPage } from './CheckoutPage'

vi.mock('@/lib/mercadopago', async (original) => ({
  ...(await original<typeof import('@/lib/mercadopago')>()),
  chavePublicaMp: () => 'TEST-chave',
  bricks: async () => brickFalso,
}))

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

  it('cartão recusado por saldo mostra a mensagem certa e deixa tentar outro', async () => {
    const chamadas = abrir('parcelado', {
      ok: false,
      pedido: PEDIDO,
      status: 'recusado',
      motivo: 'saldo',
    })
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByText(/não tem limite/)).toBeInTheDocument()
    expect(chamadas[0]).toMatchObject({ plano: 'parcelado', cartao: { token: 'tok_teste' } })
    fireEvent.click(screen.getByRole('button', { name: 'Tentar outro cartão' }))
    expect(await screen.findByRole('button', { name: 'Finalizar compra' })).toBeInTheDocument()
  })

  it('falha de comunicação vira aviso em português, sem termo técnico', async () => {
    abrir('pix', { ok: false, erro: 'falha' })
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Tente de novo em instantes')
  })
})
