import { z } from 'zod'
import { supabase } from '@/lib/supabase'

const pedido = z.object({
  plano: z.enum(['pix', 'parcelado', 'recorrente']),
  status: z.string(),
  aprovado_em: z.string().nullable(),
  fim_acesso: z.string().nullable(),
  cancelamento_pedido_em: z.string().nullable(),
  cancelamento_tipo: z.enum(['arrependimento', 'nao_renovar']).nullable(),
})

export type PedidoDaAluna = z.infer<typeof pedido>

/** Pedido em vigor da aluna e se ela já pediu o cancelamento. Null para quem não comprou. */
export async function buscarMeuPedido(): Promise<PedidoDaAluna | null> {
  const { data, error } = await supabase.functions.invoke<unknown>('cancelar-inscricao', {
    body: { acao: 'consultar' },
  })
  if (error) throw error
  return z.object({ pedido: pedido.nullable() }).parse(data).pedido
}

const resultado = z.object({
  ok: z.boolean(),
  tipo: z.enum(['arrependimento', 'nao_renovar']).nullish(),
  estornado: z.boolean().optional(),
})

export type ResultadoCancelamento = z.infer<typeof resultado>

/** Até 7 dias estorna tudo e encerra; depois registra que não renova. O servidor decide. */
export async function pedirCancelamento(motivo: string): Promise<ResultadoCancelamento> {
  const { data, error } = await supabase.functions.invoke<unknown>('cancelar-inscricao', {
    body: { acao: 'cancelar', motivo: motivo.trim() || undefined },
  })
  if (error) throw error
  const r = resultado.parse(data)
  if (!r.ok) throw new Error('cancelamento recusado')
  return r
}
