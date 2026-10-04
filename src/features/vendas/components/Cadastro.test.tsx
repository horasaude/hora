import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { FIM_OFERTA_ORA } from '@/domain/oferta'
import { Precos } from './Precos'

function abrir(respostaOk: boolean) {
  vi.useFakeTimers({ now: FIM_OFERTA_ORA.getTime() - 60_000, toFake: ['Date'] })
  sessionStorage.setItem('hora:utm', JSON.stringify({ source: 'instagram' }))
  const fetch = vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ ok: respostaOk }), { status: respostaOk ? 200 : 500 }),
    )
  vi.stubGlobal('fetch', fetch)
  render(<Precos />)
  return fetch
}

async function preencher() {
  fireEvent.click(await screen.findByRole('radio', { name: /12x de R\$\s198/ }))
  fireEvent.input(screen.getByLabelText('Seu nome'), { target: { value: 'Maria' } })
  fireEvent.input(screen.getByLabelText('Seu e-mail'), { target: { value: 'maria@teste.com' } })
  fireEvent.input(screen.getByLabelText('Seu WhatsApp'), { target: { value: '98987654321' } })
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(screen.getByRole('button', { name: 'Quero entrar na HORA' }))
}

describe('Cadastro de interessada', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    sessionStorage.clear()
  })

  it('sem preencher, mostra os erros e não envia', async () => {
    const fetch = abrir(true)
    fireEvent.click(await screen.findByRole('button', { name: 'Quero entrar na HORA' }))
    expect(await screen.findByText('Escolha como quer pagar')).toBeInTheDocument()
    expect(screen.getByText('Escreva seu nome')).toBeInTheDocument()
    expect(screen.getByText('Confira o WhatsApp com DDD')).toBeInTheDocument()
    expect(screen.getByText('Para seguir, aceite o contrato')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('mascara o WhatsApp enquanto digita', async () => {
    abrir(true)
    const campo = await screen.findByLabelText<HTMLInputElement>('Seu WhatsApp')
    fireEvent.input(campo, { target: { value: '98987654321' } })
    expect(campo.value).toBe('(98) 98765-4321')
  })

  it('envia limpo, com UTM e versão do contrato, e devolve o plano escolhido', async () => {
    const fetch = abrir(true)
    await preencher()
    expect(await screen.findByText('Cadastro feito!')).toBeInTheDocument()
    expect(
      screen.getByText(/^Você escolheu 12x de R\$\s198 no cartão, parcelado\.$/),
    ).toBeInTheDocument()
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://teste.local/functions/v1/cadastrar-interessada')
    expect(JSON.parse(String(init.body))).toMatchObject({
      nome: 'Maria',
      whatsapp: '98987654321',
      plano: 'parcelado',
      aceite: true,
      versaoTermos: '2026-10-04-provisorio',
      utm: { source: 'instagram' },
      site: '',
    })
  })

  it('se a função recusar, avisa e mantém o formulário', async () => {
    abrir(false)
    await preencher()
    expect(await screen.findByRole('alert')).toHaveTextContent('Não deu certo agora')
    expect(screen.queryByText('Cadastro feito!')).not.toBeInTheDocument()
  })
})
