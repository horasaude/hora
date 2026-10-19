import { asaas, ErroAsaas, resumoErro } from '../_shared/asaas.ts'
import { dataAsaas, PIX_MINUTOS, reais, type PrecoPedido } from '../_shared/pagamento/regras.ts'
import { statusDoPagamento } from '../_shared/pagamento/status.ts'
import { servico } from '../_shared/servico.ts'
import type { EntradaPedido } from './entrada.ts'

export type Resultado = {
  ok: boolean
  pedido?: string
  status?: string
  pix?: { copia_cola: string; qr_base64: string; expira_em: string }
  erro?: string
}

/** ip: aparelho de quem paga (o Asaas exige no cartão, para a análise de fraude). */
type Pedido = { id: string; dados: EntradaPedido; preco: PrecoPedido; ip: string }

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

/** Cartão e titular no formato do Asaas. O cartão vai direto para lá, sem passar pelo banco. */
function cartaoAsaas({ dados, ip }: Pedido) {
  const c = dados.cartao!
  return {
    creditCard: {
      holderName: c.nome,
      number: c.numero,
      expiryMonth: String(c.mes).padStart(2, '0'),
      expiryYear: String(c.ano),
      ccv: c.cvv,
    },
    creditCardHolderInfo: {
      name: dados.nome,
      email: dados.email,
      cpfCnpj: dados.cpf,
      postalCode: c.cep,
      addressNumber: c.numero_casa,
      phone: dados.whatsapp,
      mobilePhone: dados.whatsapp,
    },
    remoteIp: ip,
  }
}

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

/** Parcelado: de 1x a 12x sem juros para a cliente, sempre o mesmo total. */
export async function pagarParcelado(p: Pedido): Promise<Resultado> {
  const total = reais(p.preco.valorCentavos)
  const n = p.preco.parcelas
  const c = await asaas.criarCobranca({
    customer: await cliente(p),
    billingType: 'CREDIT_CARD',
    ...(n > 1 ? { installmentCount: n, totalValue: total } : { value: total }),
    dueDate: dataAsaas(new Date()),
    description: DESCRICAO,
    externalReference: p.id,
    ...cartaoAsaas(p),
  })
  await atualizar(p.id, { mp_pagamento_id: c.id })
  await marcarPendente(p.id, c.status)
  return { ok: true, pedido: p.id, status: statusDoPagamento(c.status) ?? 'pendente' }
}

/** Mensal: assinatura de 12 cobranças; a primeira sai na hora e o Asaas guarda o cartão. */
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
    ...cartaoAsaas(p),
  })
  const primeira = (await asaas.cobrancasDaAssinatura(a.id)).data[0]
  await atualizar(p.id, { mp_assinatura_id: a.id, mp_pagamento_id: primeira?.id ?? null })
  await servico.rpc('registrar_assinatura', {
    p_pedido: p.id,
    p_mp_assinatura: a.id,
    p_proxima: a.nextDueDate ?? null,
  })
  await marcarPendente(p.id, primeira?.status ?? a.status)
  const status = primeira ? statusDoPagamento(primeira.status) : null
  return { ok: true, pedido: p.id, status: status ?? 'pendente' }
}

const marcarPendente = (id: string, detalhe: string) =>
  servico.rpc('marcar_pedido', { p_pedido: id, p_status: 'pendente', p_detalhe: detalhe })

/** Guarda o motivo da falha no pedido, sem mudar o status. */
export async function anotarErro(id: string, e: unknown) {
  console.error('criar-pedido', resumoErro(e))
  await atualizar(id, { status_detalhe: resumoErro(e).slice(0, 120) })
}

/**
 * Erro 4xx do Asaas: 'cartao' quando o cartão foi recusado, 'dados' quando é dado da cliente
 * (ex.: CPF ou CEP). Outro erro devolve null e sobe como falha.
 */
export function motivoRecusa(e: unknown): 'cartao' | 'dados' | null {
  if (!(e instanceof ErroAsaas) || e.status < 400 || e.status >= 500) return null
  const erros = Array.isArray(e.corpo.errors) ? (e.corpo.errors as { code?: string }[]) : []
  return erros.some((x) => /creditcard/i.test(x.code ?? '')) ? 'cartao' : 'dados'
}
