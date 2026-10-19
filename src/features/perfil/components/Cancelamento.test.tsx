import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PedidoDaAluna } from '../api/cancelamento.api'
import { Cancelamento } from './Cancelamento'

const api = vi.hoisted(() => ({ buscarMeuPedido: vi.fn(), pedirCancelamento: vi.fn() }))
vi.mock('../api/cancelamento.api', () => api)

const dias = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()
const base: PedidoDaAluna = {
  plano: 'recorrente',
  status: 'aprovado',
  aprovado_em: dias(2),
  fim_acesso: '2027-10-24T15:00:00Z',
  cancelamento_pedido_em: null,
  cancelamento_tipo: null,
}

function abrir(pedido: PedidoDaAluna | null) {
  api.buscarMeuPedido.mockResolvedValue(pedido)
  const cliente = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={cliente}>
      <Cancelamento />
    </QueryClientProvider>,
  )
}

describe('cancelar inscrição', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('até 7 dias avisa da devolução integral e envia o motivo', async () => {
    api.pedirCancelamento.mockResolvedValue({ ok: true, tipo: 'arrependimento', estornado: true })
    abrir(base)
    fireEvent.click(await screen.findByRole('button', { name: 'Cancelar inscrição' }))
    expect(screen.getByText(/recebe 100% do valor de volta/)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/motivo/), { target: { value: 'sem tempo' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar cancelamento' }))
    expect(await screen.findByRole('status')).toHaveTextContent('estorno integral já foi pedido')
    expect(api.pedirCancelamento.mock.calls[0]?.[0]).toBe('sem tempo')
  })

  it('depois de 7 dias o plano segue até o fim e não renova', async () => {
    abrir({ ...base, aprovado_em: dias(30) })
    fireEvent.click(await screen.findByRole('button', { name: 'Cancelar inscrição' }))
    expect(screen.getByText(/segue normalmente até 24\/10\/2027/)).toBeInTheDocument()
  })

  it('quem já pediu vê a situação, sem o botão', async () => {
    abrir({ ...base, cancelamento_pedido_em: dias(1), cancelamento_tipo: 'nao_renovar' })
    expect(await screen.findByText(/não é renovado/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancelar inscrição' })).toBeNull()
  })

  it('sem compra não mostra nada', async () => {
    abrir(null)
    await vi.waitFor(() => expect(api.buscarMeuPedido).toHaveBeenCalled())
    expect(screen.queryByRole('button', { name: 'Cancelar inscrição' })).toBeNull()
  })
})
