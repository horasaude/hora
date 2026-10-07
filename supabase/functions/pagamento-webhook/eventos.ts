import { servico } from '../_shared/servico.ts'

/** Registra a notificação. Devolve o id do evento, ou null se ela já foi processada antes. */
export async function abrirEvento(
  tipo: string,
  recurso: string,
  status: string,
  pedido: string | null,
  dados: unknown,
): Promise<string | null> {
  const linha = { tipo, recurso_id: recurso, status, pedido_id: pedido, dados }
  const novo = await servico
    .from('eventos_pagamento')
    .upsert(linha, { onConflict: 'tipo,recurso_id,status', ignoreDuplicates: true })
    .select('id')
  if (novo.error) throw new Error(novo.error.message)
  if (novo.data?.length) return novo.data[0].id as string
  const { data } = await servico
    .from('eventos_pagamento')
    .select('id, processado_em')
    .match({ tipo, recurso_id: recurso, status })
    .single<{ id: string; processado_em: string | null }>()
  return data && !data.processado_em ? data.id : null
}

export async function fecharEvento(id: string, erro?: string): Promise<void> {
  await servico
    .from('eventos_pagamento')
    .update(
      erro ? { erro: erro.slice(0, 500) } : { processado_em: new Date().toISOString(), erro: null },
    )
    .eq('id', id)
}

export async function rpc<T>(nome: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await servico.rpc(nome, args)
  if (error) throw new Error(`${nome}: ${error.message}`)
  return data as T
}
