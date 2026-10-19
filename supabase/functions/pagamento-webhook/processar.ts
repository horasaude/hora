import { asaas, ErroAsaas, type CobrancaAsaas } from '../_shared/asaas.ts'
import {
  acaoParaPagamento,
  situacaoDaCobranca,
  statusDoPagamento,
  type StatusPedido,
} from '../_shared/pagamento/status.ts'
import { servico } from '../_shared/servico.ts'
import { avisarRecusa, CAMPOS_PEDIDO, liberar, type Pedido } from './conta.ts'
import { abrirEvento, fecharEvento, rpc } from './eventos.ts'
import type { Aviso } from './tratar.ts'

const UUID = /^[0-9a-f-]{36}$/i

async function pedidoPor(coluna: 'id' | 'mp_assinatura_id', valor: string | null | undefined) {
  if (!valor || (coluna === 'id' && !UUID.test(valor))) return null
  const { data } = await servico
    .from('pedidos')
    .select(CAMPOS_PEDIDO)
    .eq(coluna, valor)
    .maybeSingle<Pedido>()
  return data
}

/** Roda o passo uma vez por notificação; se falhar, guarda o erro e o Asaas tenta de novo. */
async function umaVez(
  tipo: string,
  id: string,
  status: string,
  pedido: Pedido,
  dados: unknown,
  passo: () => Promise<void>,
) {
  const evento = await abrirEvento(tipo, id, status, pedido.id, dados)
  if (!evento) return 'repetido'
  try {
    await passo()
    await fecharEvento(evento)
    return 'processado'
  } catch (e) {
    await fecharEvento(evento, e instanceof Error ? e.message : String(e))
    throw e
  }
}

const quando = (c: CobrancaAsaas) =>
  c.confirmedDate ?? c.clientPaymentDate ?? c.paymentDate ?? new Date().toISOString()

/** Pix e parcelado: cada parcela do parcelado chega aqui, mas só a primeira aprovação libera. */
async function avulsa(c: CobrancaAsaas, situacao: string) {
  const pedido = await pedidoPor('id', c.externalReference)
  if (!pedido) return 'sem_pedido'
  const novo = statusDoPagamento(situacao)
  return umaVez('payment', c.id, situacao, pedido, { status: situacao }, async () => {
    const acao = acaoParaPagamento(pedido.status as StatusPedido, novo)
    if (acao.tipo === 'aprovar') await liberar(pedido, new Date().toISOString())
    if (acao.tipo === 'encerrar')
      await rpc('encerrar_pedido', { p_pedido: pedido.id, p_status: acao.status })
    if (acao.tipo === 'marcar')
      await rpc('marcar_pedido', {
        p_pedido: pedido.id,
        p_status: acao.status,
        p_detalhe: situacao,
      })
  })
}

/** Cobrança da assinatura mensal: aprova, conta a parcela paga ou avisa a recusa. */
async function mensal(c: CobrancaAsaas, situacao: string) {
  const pedido = await pedidoPor('mp_assinatura_id', c.subscription)
  const novo = statusDoPagamento(situacao)
  if (!pedido || !novo || novo === 'pendente') return 'ignorado'
  if (novo === 'cancelado') return 'ignorado'
  if (novo === 'reembolsado' || novo === 'chargeback')
    return umaVez('payment', c.id, situacao, pedido, { status: situacao }, async () => {
      await rpc('encerrar_pedido', { p_pedido: pedido.id, p_status: novo })
    })
  const aprovada = novo === 'aprovado'
  const status = aprovada ? 'approved' : 'rejected'
  return umaVez('subscription_authorized_payment', c.id, status, pedido, { situacao }, async () => {
    const a = await asaas.assinatura(c.subscription!)
    if (aprovada && pedido.status !== 'aprovado') await liberar(pedido, new Date().toISOString())
    await rpc('cobranca_assinatura', {
      p_pedido: pedido.id,
      p_aprovada: aprovada,
      p_quando: quando(c),
      p_proxima: a.nextDueDate ?? null,
    })
    if (!aprovada && pedido.status === 'aprovado') await avisarRecusa(pedido, c.id, c.invoiceUrl)
    if (!aprovada && pedido.status !== 'aprovado')
      await rpc('marcar_pedido', { p_pedido: pedido.id, p_status: 'recusado', p_detalhe: situacao })
  })
}

async function cobranca(aviso: Aviso) {
  const c = await asaas.cobranca(aviso.id)
  const situacao = situacaoDaCobranca(aviso.evento, c)
  return c.subscription ? mensal(c, situacao) : avulsa(c, situacao)
}

/** Assinatura apagada ou inativada no Asaas: cancela (com arrependimento nos 7 primeiros dias). */
async function assinatura(aviso: Aviso) {
  const a = await asaas.assinatura(aviso.id)
  if (!a.deleted && a.status !== 'INACTIVE') return 'ignorado'
  const pedido = await pedidoPor('mp_assinatura_id', a.id)
  if (!pedido) return 'sem_pedido'
  return umaVez(
    'subscription_preapproval',
    a.id,
    'cancelled',
    pedido,
    { status: a.status },
    async () => {
      await rpc('cancelar_assinatura', { p_pedido: pedido.id })
    },
  )
}

/** Recurso que o Asaas não acha responde 200 e não é reenviado (a fila do Asaas trava com erro). */
export async function processar(aviso: Aviso): Promise<string> {
  try {
    return await (aviso.tipo === 'cobranca' ? cobranca(aviso) : assinatura(aviso))
  } catch (e) {
    if (e instanceof ErroAsaas && e.status === 404) return 'nao_encontrado'
    throw e
  }
}
