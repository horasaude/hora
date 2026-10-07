import { z } from 'zod'
import type { Plano } from '@/domain/precos'
import { env } from '@/lib/env'
import type { DadosCartao } from '@/lib/mercadopago'
import type { Utms } from '@/lib/utm'

const URL_FUNCAO = `${env.VITE_SUPABASE_URL}/functions/v1/criar-pedido`

export const MOTIVOS = ['saldo', 'dados', 'banco', 'outro'] as const
export type Motivo = (typeof MOTIVOS)[number]

const resposta = z.object({
  ok: z.boolean(),
  pedido: z.string().optional(),
  status: z.string().optional(),
  motivo: z.enum(MOTIVOS).optional(),
  erro: z.string().optional(),
  pix: z
    .object({ copia_cola: z.string(), qr_base64: z.string(), expira_em: z.string() })
    .optional(),
})

export type RespostaPedido = z.infer<typeof resposta>
export type Pix = NonNullable<RespostaPedido['pix']>

export type NovoPedido = {
  plano: Plano
  nome: string
  email: string
  cpf: string
  whatsapp: string
  indicacao: string | null
  utms: Utms
  cartao?: DadosCartao
}

async function chamar(corpo: unknown): Promise<RespostaPedido> {
  try {
    const r = await fetch(URL_FUNCAO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    })
    const lido = resposta.safeParse(await r.json())
    return lido.success ? lido.data : { ok: false, erro: 'falha' }
  } catch {
    return { ok: false, erro: 'falha' }
  }
}

/** Cria o pedido e o pagamento. O valor é decidido no servidor. */
export const criarPedido = (p: NovoPedido) => chamar({ acao: 'criar', ...p })

export const trocarCartao = (pedido: string, cartao: DadosCartao) =>
  chamar({ acao: 'trocar-cartao', pedido, cartao })
