import { ErroMp, mp, type PagamentoMp } from '../_shared/mp.ts'
import { motivoRecusa, statusDoPagamento, type MotivoRecusa } from '../_shared/pagamento/status.ts'
import { dataMp, PIX_MINUTOS, reais, type PrecoPedido } from '../_shared/pagamento/regras.ts'
import { servico, SITE } from '../_shared/servico.ts'
import type { Cartao, EntradaPedido } from './entrada.ts'

export type Resultado = {
  ok: boolean
  pedido?: string
  status?: string
  motivo?: MotivoRecusa
  pix?: { copia_cola: string; qr_base64: string; expira_em: string }
  erro?: string
}

type Pedido = { id: string; dados: EntradaPedido; preco: PrecoPedido }

const DESCRICAO = 'ORA: comunidade de 12 meses'

function pagador(d: EntradaPedido) {
  const [primeiro, ...resto] = d.nome.split(/\s+/)
  return {
    email: d.email,
    first_name: primeiro,
    last_name: resto.join(' '),
    identification: { type: 'CPF', number: d.cpf },
  }
}

const atualizar = (id: string, campos: Record<string, unknown>) =>
  servico.from('pedidos').update(campos).eq('id', id)

async function marcar(id: string, p: PagamentoMp): Promise<Resultado> {
  const status = statusDoPagamento(p.status) ?? 'pendente'
  await atualizar(id, { mp_pagamento_id: String(p.id) })
  if (status === 'pendente' || status === 'recusado')
    await servico.rpc('marcar_pedido', {
      p_pedido: id,
      p_status: status,
      p_detalhe: p.status_detail ?? '',
    })
  if (status === 'recusado')
    return { ok: false, pedido: id, status, motivo: motivoRecusa(p.status_detail) }
  return { ok: true, pedido: id, status }
}

export async function pagarPix({ id, dados, preco }: Pedido): Promise<Resultado> {
  const expira = new Date(Date.now() + PIX_MINUTOS * 60_000)
  const p = await mp.criarPagamento(
    {
      transaction_amount: reais(preco.valorCentavos),
      payment_method_id: 'pix',
      description: DESCRICAO,
      external_reference: id,
      date_of_expiration: dataMp(expira),
      payer: pagador(dados),
    },
    id,
  )
  const pix = p.point_of_interaction?.transaction_data
  if (!pix?.qr_code || !pix.qr_code_base64) return { ok: false, pedido: id, erro: 'falha' }
  await atualizar(id, { pix_copia_cola: pix.qr_code, pix_expira_em: expira.toISOString() })
  const r = await marcar(id, p)
  return {
    ...r,
    pix: {
      copia_cola: pix.qr_code,
      qr_base64: pix.qr_code_base64,
      expira_em: expira.toISOString(),
    },
  }
}

export async function pagarParcelado({ id, dados, preco }: Pedido, c: Cartao): Promise<Resultado> {
  try {
    const p = await mp.criarPagamento(
      {
        transaction_amount: reais(preco.valorCentavos),
        token: c.token,
        installments: preco.parcelas,
        payment_method_id: c.payment_method_id,
        issuer_id: c.issuer_id ? Number(c.issuer_id) : undefined,
        description: DESCRICAO,
        statement_descriptor: 'ORA',
        external_reference: id,
        payer: pagador(dados),
      },
      id,
    )
    return await marcar(id, p)
  } catch (e) {
    return recusa(id, e)
  }
}

async function recusa(id: string, e: unknown): Promise<Resultado> {
  if (!(e instanceof ErroMp) || e.status >= 500) throw e
  await servico.rpc('marcar_pedido', {
    p_pedido: id,
    p_status: 'recusado',
    p_detalhe: 'dados_cartao',
  })
  return { ok: false, pedido: id, status: 'recusado', motivo: 'dados' }
}

/** Fim da assinatura: depois da 12ª cobrança e antes da 13ª. */
const fimDaAssinatura = () => {
  const d = new Date()
  d.setUTCMonth(d.getUTCMonth() + 11)
  return new Date(d.getTime() + 20 * 86_400_000)
}

export async function assinar({ id, dados, preco }: Pedido, c: Cartao): Promise<Resultado> {
  try {
    const a = await mp.criarAssinatura(
      {
        reason: 'ORA: mensalidade (12 meses)',
        external_reference: id,
        payer_email: dados.email,
        card_token_id: c.token,
        back_url: `${SITE}/obrigada?pedido=${id}`,
        status: 'authorized',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          end_date: dataMp(fimDaAssinatura()),
          transaction_amount: reais(preco.valorCentavos),
          currency_id: 'BRL',
        },
      },
      id,
    )
    await atualizar(id, { mp_assinatura_id: a.id })
    await servico.rpc('registrar_assinatura', {
      p_pedido: id,
      p_mp_assinatura: a.id,
      p_proxima: a.next_payment_date ?? null,
    })
    await servico.rpc('marcar_pedido', { p_pedido: id, p_status: 'pendente', p_detalhe: a.status })
    return { ok: true, pedido: id, status: 'pendente' }
  } catch (e) {
    return recusa(id, e)
  }
}
