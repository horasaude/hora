// Cliente mínimo da API do Asaas (v3). A chave vem do secret ASAAS_API_KEY; o ambiente sai do
// prefixo dela ($aact_prod_ é produção, o resto é sandbox), então trocar de conta é só trocar o secret.

export class ErroAsaas extends Error {
  constructor(
    public status: number,
    public corpo: Record<string, unknown>,
  ) {
    super(`Asaas respondeu ${status}`)
  }
}

const chave = () => Deno.env.get('ASAAS_API_KEY') ?? ''

export const baseAsaas = (k: string) =>
  k.startsWith('$aact_prod_') ? 'https://api.asaas.com/v3' : 'https://api-sandbox.asaas.com/v3'

type Opcoes = { metodo?: 'GET' | 'POST' | 'DELETE'; corpo?: unknown }

async function chamar<T>(caminho: string, o: Opcoes = {}): Promise<T> {
  const k = chave()
  if (!k) throw new ErroAsaas(500, { errors: [{ description: 'ASAAS_API_KEY ausente' }] })
  const r = await fetch(baseAsaas(k) + caminho, {
    method: o.metodo ?? 'GET',
    headers: { access_token: k, 'Content-Type': 'application/json', 'User-Agent': 'ORA' },
    body: o.corpo === undefined ? undefined : JSON.stringify(o.corpo),
  })
  const corpo = (await r.json().catch(() => ({}))) as Record<string, unknown>
  if (!r.ok) throw new ErroAsaas(r.status, corpo)
  return corpo as T
}

export type CobrancaAsaas = {
  id: string
  status: string
  value?: number
  externalReference?: string | null
  subscription?: string | null
  installment?: string | null
  invoiceUrl?: string
  dueDate?: string
  confirmedDate?: string | null
  paymentDate?: string | null
  clientPaymentDate?: string | null
}

export type AssinaturaAsaas = {
  id: string
  status: string
  externalReference?: string | null
  nextDueDate?: string
  deleted?: boolean
}

export type PixAsaas = { encodedImage: string; payload: string; expirationDate?: string }

type Lista<T> = { data: T[] }

const id = (v: string) => encodeURIComponent(v)

export const asaas = {
  criarCliente: (corpo: unknown) => chamar<{ id: string }>('/customers', { metodo: 'POST', corpo }),
  criarCobranca: (corpo: unknown) => chamar<CobrancaAsaas>('/payments', { metodo: 'POST', corpo }),
  cobranca: (c: string) => chamar<CobrancaAsaas>(`/payments/${id(c)}`),
  pix: (c: string) => chamar<PixAsaas>(`/payments/${id(c)}/pixQrCode`),
  criarAssinatura: (corpo: unknown) =>
    chamar<AssinaturaAsaas>('/subscriptions', { metodo: 'POST', corpo }),
  assinatura: (a: string) => chamar<AssinaturaAsaas>(`/subscriptions/${id(a)}`),
  cobrancasDaAssinatura: (a: string) =>
    chamar<Lista<CobrancaAsaas>>(`/subscriptions/${id(a)}/payments`),
  /** Estorno integral de uma cobrança (cartão volta na fatura, Pix volta na conta de quem pagou). */
  estornar: (c: string) =>
    chamar<CobrancaAsaas>(`/payments/${id(c)}/refund`, { metodo: 'POST', corpo: {} }),
  /** Estorno de todas as parcelas de um parcelamento no cartão. */
  estornarParcelamento: (i: string) =>
    chamar<unknown>(`/installments/${id(i)}/refund`, { metodo: 'POST', corpo: {} }),
  /** Apaga a assinatura: o Asaas para de gerar as próximas cobranças. */
  apagarAssinatura: (a: string) =>
    chamar<{ deleted: boolean }>(`/subscriptions/${id(a)}`, { metodo: 'DELETE' }),
}

/** Resumo do erro do Asaas (código e descrição, sem dados da cliente) para achar a causa. */
export function resumoErro(e: unknown): string {
  if (!(e instanceof ErroAsaas)) return e instanceof Error ? e.message : 'erro'
  const erros = Array.isArray(e.corpo.errors)
    ? (e.corpo.errors as { code?: string; description?: string }[])
    : []
  const texto = erros.map((x) => [x.code, x.description].filter(Boolean).join(' ')).join('; ')
  return `asaas ${e.status} ${texto}`.trim()
}
