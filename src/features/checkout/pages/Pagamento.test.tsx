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

function preencherCartao() {
  const digitar = (rotulo: string, value: string) =>
    fireEvent.input(screen.getByLabelText(rotulo), { target: { value } })
  digitar('Número do cartão', '5162306219378829')
  digitar('Nome impresso no cartão', 'MARIA SILVA')
  digitar('Validade', '0530')
  digitar('CVV', '318')
  digitar('CEP da fatura', '65000123')
  digitar('Número do endereço', '120')
}

const limpar = () => {
  cleanup()
  vi.unstubAllGlobals()
  sessionStorage.clear()
}

describe('pagamento no checkout', () => {
  afterEach(limpar)

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
})

describe('cartão no checkout', () => {
  afterEach(limpar)

  it('cartão é digitado aqui, escolhe as parcelas e segue para a página de obrigada', async () => {
    const assign = vi.fn()
    vi.stubGlobal('location', { ...window.location, assign })
    const chamadas = abrir('parcelado', { ok: true, pedido: PEDIDO, status: 'aprovado' })
    preencherCartao()
    fireEvent.change(screen.getByLabelText('Parcelas'), { target: { value: '3' } })
    await vi.waitFor(() => expect(screen.getAllByText(/^3x de R\$/)).toHaveLength(2))
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    await vi.waitFor(() => expect(assign).toHaveBeenCalledWith(`/obrigada?pedido=${PEDIDO}`))
    expect(chamadas[0]).toMatchObject({
      plano: 'parcelado',
      parcelas: 3,
      cartao: { numero: '5162306219378829', mes: 5, ano: 2030, cvv: '318', cep: '65000123' },
    })
  })

  it('cartão inválido nem é enviado', async () => {
    const chamadas = abrir('parcelado', { ok: true, pedido: PEDIDO })
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByText('Confira o número do cartão')).toBeInTheDocument()
    expect(chamadas).toHaveLength(0)
  })

  it('cartão recusado pede para conferir ou usar outro cartão', async () => {
    abrir('parcelado', { ok: false, pedido: PEDIDO, erro: 'cartao' })
    preencherCartao()
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('use outro cartão')
  })

  it('CEP que o Asaas não acha pede para conferir o CEP', async () => {
    abrir('parcelado', { ok: false, pedido: PEDIDO, erro: 'cep' })
    preencherCartao()
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Confira o CEP')
  })

  it('dado recusado pelo Asaas pede para conferir os dados', async () => {
    abrir('pix', { ok: false, pedido: PEDIDO, erro: 'dados' })
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Confira seus dados')
  })

  it('falha de comunicação vira aviso em português, sem termo técnico', async () => {
    abrir('pix', { ok: false, erro: 'falha' })
    fireEvent.click(await screen.findByRole('button', { name: 'Finalizar compra' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Tente de novo em instantes')
  })
})
