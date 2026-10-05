import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { irPara } from '@/lib/navegacao'
import { linkPagamento } from '../../api/pagamento'
import { BotaoCompra } from '../BotaoCompra'
import { CompraProvider } from './CompraProvider'

vi.mock('@/lib/navegacao', () => ({ irPara: vi.fn() }))
vi.mock('../../api/pagamento', () => ({ linkPagamento: vi.fn() }))

async function abrir(
  respostaFuncao: () => Promise<Response>,
  plano?: 'pix' | 'parcelado' | 'recorrente',
) {
  const fetch = vi.fn(respostaFuncao)
  vi.stubGlobal('fetch', fetch)
  render(
    <CompraProvider>
      <BotaoCompra plano={plano}>Quero este</BotaoCompra>
    </CompraProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Quero este' }))
  await screen.findByLabelText('Nome', {}, { timeout: 5000 })
  return fetch
}

function preencher() {
  fireEvent.input(screen.getByPlaceholderText('Digite seu nome'), { target: { value: 'Maria' } })
  fireEvent.input(screen.getByPlaceholderText('Digite seu melhor e-mail'), {
    target: { value: 'maria@teste.com' },
  })
  fireEvent.input(screen.getByPlaceholderText('Digite seu DDD + WhatsApp'), {
    target: { value: '98987654321' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Fazer minha inscrição' }))
}

const ok = () => Promise.resolve(new Response('{"ok":true}'))

// O formulário carrega sob demanda; baixar antes evita que o primeiro teste pague esse custo.
beforeAll(async () => {
  await import('./CompraForm')
})

describe('Popup de compra', () => {
  beforeEach(() => {
    vi.mocked(linkPagamento).mockImplementation((plano) => `https://mp.teste/${plano}`)
  })
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('abre com o título, o plano escolhido, só três campos e sem checkbox', async () => {
    await abrir(ok, 'pix')
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('open')
    expect(
      screen.getByText('Preencha os dados abaixo e garanta a sua inscrição'),
    ).toBeInTheDocument()
    expect(screen.getByText('Plano escolhido')).toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'Termos de uso' })).toHaveAttribute('href', '/termos')
  })

  it('sem preencher, mostra os erros e não sai da página', async () => {
    const fetch = await abrir(ok)
    fireEvent.click(screen.getByRole('button', { name: 'Fazer minha inscrição' }))
    expect(await screen.findByText('Escreva seu nome')).toBeInTheDocument()
    expect(screen.getByText('Confira o WhatsApp com DDD')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
    expect(irPara).not.toHaveBeenCalled()
  })

  it('grava o lead e vai para o link do plano escolhido', async () => {
    const fetch = await abrir(ok, 'pix')
    preencher()
    await vi.waitFor(() => expect(irPara).toHaveBeenCalledWith('https://mp.teste/pix'))
    const corpo = JSON.parse(
      String((fetch.mock.calls[0] as unknown as [string, RequestInit])[1].body),
    )
    expect(corpo).toMatchObject({ nome: 'Maria', whatsapp: '98987654321', plano: 'pix' })
  })

  it('se a função falhar, vai para o pagamento mesmo assim', async () => {
    await abrir(() => Promise.reject(new TypeError('Failed to fetch')))
    preencher()
    await vi.waitFor(() => expect(irPara).toHaveBeenCalledWith('https://mp.teste/parcelado'))
  })

  it('sem link configurado, avisa em vez de sair', async () => {
    vi.mocked(linkPagamento).mockReturnValue(null)
    await abrir(ok)
    preencher()
    expect(await screen.findByRole('alert')).toHaveTextContent('ainda não está disponível')
    expect(irPara).not.toHaveBeenCalled()
  })

  it('trava a rolagem da página enquanto aberto e solta ao fechar', async () => {
    await abrir(ok)
    expect(document.documentElement).toHaveClass('overflow-hidden')
    fireEvent.click(screen.getByRole('button', { name: 'Fechar', hidden: true }))
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open')
    expect(document.documentElement).not.toHaveClass('overflow-hidden')
  })
})
