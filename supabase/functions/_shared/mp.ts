// Cliente mínimo da API do Mercado Pago (https://api.mercadopago.com). Endpoints e campos conferidos
// no SDK oficial (mercadopago 3.6): /v1/payments, /preapproval e /authorized_payments.
// A chave de acesso vem do secret MP_ACCESS_TOKEN; trocar de conta é só trocar o secret.

const BASE = 'https://api.mercadopago.com'

export class ErroMp extends Error {
  constructor(
    public status: number,
    public corpo: Record<string, unknown>,
  ) {
    super(`Mercado Pago respondeu ${status}`)
  }
}

type Opcoes = { metodo?: 'GET' | 'POST' | 'PUT'; corpo?: unknown; idempotencia?: string }

async function chamar<T>(caminho: string, o: Opcoes = {}): Promise<T> {
  const token = Deno.env.get('MP_ACCESS_TOKEN') ?? ''
  if (!token) throw new ErroMp(500, { message: 'MP_ACCESS_TOKEN ausente' })
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
  if (o.idempotencia) headers['X-Idempotency-Key'] = o.idempotencia
  const r = await fetch(BASE + caminho, {
    method: o.metodo ?? 'GET',
    headers,
    body: o.corpo === undefined ? undefined : JSON.stringify(o.corpo),
  })
  const corpo = (await r.json().catch(() => ({}))) as Record<string, unknown>
  if (!r.ok) throw new ErroMp(r.status, corpo)
  return corpo as T
}

export type PagamentoMp = {
  id: number
  status: string
  status_detail?: string
  external_reference?: string
  date_approved?: string | null
  transaction_amount?: number
  point_of_interaction?: {
    transaction_data?: { qr_code?: string; qr_code_base64?: string; ticket_url?: string }
  }
}

export type AssinaturaMp = {
  id: string
  status: string
  external_reference?: string
  next_payment_date?: string
  date_created?: string
}

/** Cobrança de assinatura (authorized payment), com o pagamento dentro. */
export type CobrancaMp = {
  id: number | string
  preapproval_id?: string
  status?: string
  debit_date?: string
  date_created?: string
  payment?: { id: number | string; status: string; status_detail?: string }
}

export const mp = {
  criarPagamento: (corpo: unknown, idempotencia: string) =>
    chamar<PagamentoMp>('/v1/payments', { metodo: 'POST', corpo, idempotencia }),
  pagamento: (id: string) => chamar<PagamentoMp>(`/v1/payments/${encodeURIComponent(id)}`),
  criarAssinatura: (corpo: unknown, idempotencia: string) =>
    chamar<AssinaturaMp>('/preapproval', { metodo: 'POST', corpo, idempotencia }),
  assinatura: (id: string) => chamar<AssinaturaMp>(`/preapproval/${encodeURIComponent(id)}`),
  atualizarAssinatura: (id: string, corpo: unknown) =>
    chamar<AssinaturaMp>(`/preapproval/${encodeURIComponent(id)}`, { metodo: 'PUT', corpo }),
  cobranca: (id: string) => chamar<CobrancaMp>(`/authorized_payments/${encodeURIComponent(id)}`),
}
