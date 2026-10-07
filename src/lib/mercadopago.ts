import { loadMercadoPago } from '@mercadopago/sdk-js'

// Carrega o SDK do Mercado Pago (script oficial) e monta o Payment Brick.
// A chave pública vem de VITE_MP_PUBLIC_KEY; sem ela o checkout mostra que o pagamento não está disponível.

/** Dados do cartão devolvidos pelo Brick (token gerado nos campos seguros). */
export type DadosCartao = {
  token: string
  payment_method_id: string
  issuer_id?: string | number
  installments?: number
}

export type DadosBrick = { selectedPaymentMethod?: string; formData?: Partial<DadosCartao> }

export type ControleBrick = {
  getFormData: () => Promise<DadosBrick | null | undefined> | DadosBrick | null | undefined
  unmount: () => void
}

type Construtor = {
  create: (nome: 'payment', container: string, ajustes: unknown) => Promise<ControleBrick>
}
type MercadoPago = new (chave: string, opcoes: { locale: string }) => { bricks: () => Construtor }

export const chavePublicaMp = (): string => import.meta.env.VITE_MP_PUBLIC_KEY ?? ''

let construtor: Promise<Construtor> | null = null

export function bricks(chave: string): Promise<Construtor> {
  construtor ??= loadMercadoPago().then(() => {
    const Mp = (window as unknown as { MercadoPago?: MercadoPago }).MercadoPago
    if (!Mp) throw new Error('sdk')
    return new Mp(chave, { locale: 'pt-BR' }).bricks()
  })
  return construtor
}

/** Token do cartão a partir do Brick. Formulário incompleto devolve null (o Brick marca os campos). */
export async function cartaoDoBrick(c: ControleBrick): Promise<DadosCartao | null> {
  const dados = await c.getFormData()
  const f = dados?.formData
  if (!f?.token || !f.payment_method_id) return null
  return {
    token: f.token,
    payment_method_id: f.payment_method_id,
    issuer_id: f.issuer_id,
    installments: f.installments,
  }
}
