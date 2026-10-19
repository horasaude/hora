import { asaas, ErroAsaas, resumoErro } from '../_shared/asaas.ts'
import { dataAsaas, PIX_MINUTOS, reais, type PrecoPedido } from '../_shared/pagamento/regras.ts'
import { servico, SITE } from '../_shared/servico.ts'
import type { EntradaPedido } from './entrada.ts'

export type Resultado = {
  ok: boolean
  pedido?: string
  status?: string
  /** Cartão: página segura do Asaas onde a cliente digita o cartão. */
  pagar_url?: string
  pix?: { copia_cola: string; qr_base64: string; expira_em: string }
  erro?: string
}

type Pedido = { id: string; dados: EntradaPedido; preco: PrecoPedido }

const DESCRICAO = 'ORA: comunidade de 12 meses'

const atualizar = (id: string, campos: Record<string, unknown>) =>
  servico.from('pedidos').update(campos).eq('id', id)

/** Cliente no Asaas, uma por pedido, sem os avisos do Asaas (os e-mails saem do ORA). */
async function cliente({ id, dados }: Pedido): Promise<string> {
  const c = await asaas.criarCliente({
    name: dados.nome,
    email: dados.email,
    cpfCnpj: dados.cpf,
    mobilePhone: dados.whatsapp,
    externalReference: id,
    notificationDisabled: true,
  })
  return c.id
}

/** Volta para o ORA depois de pagar na página do Asaas. */
const retorno = (id: string) => ({
  successUrl: `${SITE}/obrigada?pedido=${id}`,
  autoRedirect: true,
})

export async function pagarPix(p: Pedido): Promise<Resultado> {
  const expira = new Date(Date.now() + PIX_MINUTOS * 60_000)
  const c = await asaas.criarCobranca({
    customer: await cliente(p),
    billingType: 'PIX',
    value: reais(p.preco.valorCentavos),
    dueDate: dataAsaas(new Date()),
    description: DESCRICAO,
    externalReference: p.id,
  })
  const pix = await asaas.pix(c.id)
  if (!pix.payload || !pix.encodedImage) return { ok: false, pedido: p.id, erro: 'falha' }
  await atualizar(p.id, {
    mp_pagamento_id: c.id,
    pix_copia_cola: pix.payload,
    pix_expira_em: expira.toISOString(),
  })
  await marcarPendente(p.id, c.status)
  return {
    ok: true,
    pedido: p.id,
    status: 'pendente',
    pix: { copia_cola: pix.payload, qr_base64: pix.encodedImage, expira_em: expira.toISOString() },
  }
}

/** Parcelado: uma cobrança em até 12x sem juros para a cliente; o cartão vai na página do Asaas. */
export async function pagarParcelado(p: Pedido): Promise<Resultado> {
  const c = await asaas.criarCobranca({
    customer: await cliente(p),
    billingType: 'CREDIT_CARD',
    installmentCount: p.preco.parcelas,
    totalValue: reais(p.preco.valorCentavos),
    dueDate: dataAsaas(new Date()),
    description: DESCRICAO,
    externalReference: p.id,
    callback: retorno(p.id),
  })
  if (!c.invoiceUrl) return { ok: false, pedido: p.id, erro: 'falha' }
  await atualizar(p.id, { mp_pagamento_id: c.id })
  await marcarPendente(p.id, c.status)
  return { ok: true, pedido: p.id, status: 'pendente', pagar_url: c.invoiceUrl }
}

/** Mensal: assinatura de 12 cobranças; a primeira é paga na página do Asaas, que guarda o cartão. */
export async function assinar(p: Pedido): Promise<Resultado> {
  const a = await asaas.criarAssinatura({
    customer: await cliente(p),
    billingType: 'CREDIT_CARD',
    value: reais(p.preco.valorCentavos),
    nextDueDate: dataAsaas(new Date()),
    cycle: 'MONTHLY',
    maxPayments: p.preco.parcelas,
    description: 'ORA: mensalidade (12 meses)',
    externalReference: p.id,
    callback: retorno(p.id),
  })
  const primeira = (await asaas.cobrancasDaAssinatura(a.id)).data[0]
  if (!primeira?.invoiceUrl) return { ok: false, pedido: p.id, erro: 'falha' }
  await atualizar(p.id, { mp_assinatura_id: a.id, mp_pagamento_id: primeira.id })
  await servico.rpc('registrar_assinatura', {
    p_pedido: p.id,
    p_mp_assinatura: a.id,
    p_proxima: a.nextDueDate ?? null,
  })
  await marcarPendente(p.id, a.status)
  return { ok: true, pedido: p.id, status: 'pendente', pagar_url: primeira.invoiceUrl }
}

const marcarPendente = (id: string, detalhe: string) =>
  servico.rpc('marcar_pedido', { p_pedido: id, p_status: 'pendente', p_detalhe: detalhe })

/** Guarda o motivo da falha no pedido, sem mudar o status. */
export async function anotarErro(id: string, e: unknown) {
  console.error('criar-pedido', resumoErro(e))
  await atualizar(id, { status_detalhe: resumoErro(e).slice(0, 120) })
}

/** Erro 4xx do Asaas é dado recusado (ex.: CPF inválido); o resto sobe como falha. */
export const recusaDeDados = (e: unknown) =>
  e instanceof ErroAsaas && e.status >= 400 && e.status < 500
