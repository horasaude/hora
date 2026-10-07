import { z } from 'zod'
import { env } from './env'

// Situação de um pedido pelo id (o mesmo que vai ao Mercado Pago como external_reference).
// Função do banco que devolve só status, plano e valor; nada de dado pessoal.

export const STATUS_PEDIDO = [
  'criado',
  'pendente',
  'aprovado',
  'recusado',
  'reembolsado',
  'cancelado',
  'chargeback',
] as const

const esquema = z.object({
  status: z.enum(STATUS_PEDIDO),
  plano: z.enum(['pix', 'parcelado', 'recorrente']),
  valor_centavos: z.number().int(),
})

export type SituacaoPedido = z.infer<typeof esquema>

export const pedidoValido = (id: string | null): id is string =>
  !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

export async function situacaoPedido(id: string): Promise<SituacaoPedido | null> {
  const r = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/rpc/situacao_pedido`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ p_pedido: id }),
  })
  if (!r.ok) throw new Error('situacao')
  const lido = esquema.safeParse(await r.json())
  return lido.success ? lido.data : null
}
