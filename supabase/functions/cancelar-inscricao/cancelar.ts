import { asaas, resumoErro } from '../_shared/asaas.ts'
import { naoRenovar, reembolsoFeito } from '../_shared/email/cancelamento.ts'
import { enviarEmail } from '../_shared/email/enviar.ts'
import { linkWhatsApp } from '../_shared/email/modelos.ts'
import { tipoDeCancelamento } from '../_shared/pagamento/cancelamento.ts'
import { servico, SITE } from '../_shared/servico.ts'

export type PedidoAluna = {
  id: string
  nome: string
  email: string
  plano: 'pix' | 'parcelado' | 'recorrente'
  status: string
  aprovado_em: string | null
  mp_pagamento_id: string | null
  mp_assinatura_id: string | null
  cancelamento_pedido_em: string | null
  cancelamento_tipo: string | null
}

export const CAMPOS =
  'id, nome, email, plano, status, aprovado_em, mp_pagamento_id, mp_assinatura_id, cancelamento_pedido_em, cancelamento_tipo'

const whatsapp = () => linkWhatsApp(Deno.env.get('WHATSAPP_NUMERO'))
const dataBr = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })

/** Estorno integral no Asaas: Pix e 1x pela cobrança, parcelado pelo parcelamento, mensal apaga a assinatura. */
async function estornarTudo(p: PedidoAluna) {
  if (!p.mp_pagamento_id) throw new Error('pedido sem cobrança no Asaas')
  const c = await asaas.cobranca(p.mp_pagamento_id)
  if (c.installment) await asaas.estornarParcelamento(c.installment)
  else await asaas.estornar(c.id)
  if (p.mp_assinatura_id) await asaas.apagarAssinatura(p.mp_assinatura_id)
}

/** Marca o pedido de cancelamento uma vez só; o segundo clique não faz nada. */
async function registrar(p: PedidoAluna, tipo: string, motivo: string | null): Promise<boolean> {
  const { data } = await servico
    .from('pedidos')
    .update({
      cancelamento_pedido_em: new Date().toISOString(),
      cancelamento_tipo: tipo,
      cancelamento_motivo: motivo,
    })
    .eq('id', p.id)
    .is('cancelamento_pedido_em', null)
    .select('id')
  return (data ?? []).length > 0
}

/**
 * Até 7 dias da aprovação: estorna tudo e encerra o acesso. Se o estorno falhar, o pedido fica
 * registrado (a equipe estorna à mão; o painel mostra) e o acesso continua até lá.
 * Depois dos 7 dias: só registra que não vai renovar; o plano segue até o fim.
 */
export async function cancelar(p: PedidoAluna, fimAcesso: string | null, motivo: string | null) {
  const tipo = tipoDeCancelamento(new Date(p.aprovado_em!), new Date())
  if (!(await registrar(p, tipo, motivo))) return { ok: true, tipo: p.cancelamento_tipo }
  const base = { site: SITE, nome: p.nome, whatsapp: whatsapp() }
  if (tipo === 'nao_renovar') {
    const fim = fimAcesso ? dataBr(fimAcesso) : ''
    await enviarEmail(p.email, naoRenovar({ ...base, fim }), `nao-renovar-${p.id}`)
    return { ok: true, tipo, fim: fimAcesso }
  }
  let estornado = true
  try {
    await estornarTudo(p)
    const { error } = await servico.rpc('encerrar_pedido', {
      p_pedido: p.id,
      p_status: 'reembolsado',
    })
    if (error) throw new Error(error.message)
  } catch (e) {
    estornado = false
    console.error('cancelar-inscricao', resumoErro(e))
    await servico
      .from('pedidos')
      .update({ status_detalhe: `estorno pendente: ${resumoErro(e)}`.slice(0, 120) })
      .eq('id', p.id)
  }
  await enviarEmail(p.email, reembolsoFeito({ ...base, estornado }), `reembolso-${p.id}`)
  return { ok: true, tipo, estornado }
}
