// Vendas para o Financeiro do CRM: pedidos pagos, estornados, cancelados ou contestados.
import { supabase } from '@/lib/supabase'
import { ok } from '../api/conteudo.api'

export type Venda = {
  id: string
  nome: string
  email: string
  plano: string
  status: string
  valor_centavos: number
  aprovado_em: string | null
  perfil_id: string | null
}

export async function listarVendas(): Promise<Venda[]> {
  return ok(
    await supabase
      .from('pedidos')
      .select('id, nome, email, plano, status, valor_centavos, aprovado_em, perfil_id')
      .in('status', ['aprovado', 'reembolsado', 'cancelado', 'chargeback'])
      .order('aprovado_em', { ascending: false, nullsFirst: false })
      .limit(1000),
  )
}
