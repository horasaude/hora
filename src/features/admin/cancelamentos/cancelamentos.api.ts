import { supabase } from '@/lib/supabase'

export type Cancelamento = {
  id: string
  nome: string
  email: string
  plano: string
  status: string
  aprovado_em: string | null
  cancelamento_pedido_em: string
  cancelamento_tipo: 'arrependimento' | 'nao_renovar'
  cancelamento_motivo: string | null
}

/** Pedidos de cancelamento feitos pelas alunas, do mais novo para o mais antigo. */
export async function listarCancelamentos(): Promise<Cancelamento[]> {
  const { data, error } = await supabase
    .from('pedidos')
    .select(
      'id, nome, email, plano, status, aprovado_em, cancelamento_pedido_em, cancelamento_tipo, cancelamento_motivo',
    )
    .not('cancelamento_pedido_em', 'is', null)
    .order('cancelamento_pedido_em', { ascending: false })
    .limit(500)
  if (error) throw error
  return (data ?? []) as Cancelamento[]
}

/** Estorno dentro dos 7 dias que o Asaas não fez: a equipe estorna à mão. */
export const estornoPendente = (c: Cancelamento) =>
  c.cancelamento_tipo === 'arrependimento' && c.status === 'aprovado'
