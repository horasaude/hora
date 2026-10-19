// Cria o pedido do checkout e a cobrança no Asaas: Pix na tela, cartão em até 12x ou assinatura mensal
// (o cartão é digitado na página segura do Asaas).
// O preço é decidido aqui, pela tabela configuracoes; o acesso só é liberado pelo webhook.
import { cabecalhosCors, origemPermitida } from '../_shared/cors.ts'
import { precoPedido, type ConfiguracaoPrecos } from '../_shared/pagamento/regras.ts'
import { json, servico } from '../_shared/servico.ts'
import { esquemaPedido, type EntradaPedido } from './entrada.ts'
import {
  anotarErro,
  assinar,
  pagarParcelado,
  pagarPix,
  recusaDeDados,
  type Resultado,
} from './pagar.ts'

async function criar(dados: EntradaPedido): Promise<[Resultado, number]> {
  const { data: config, error } = await servico
    .from('configuracoes')
    .select(
      'pix_cheio, parcelado_cheio, recorrente_cheio, pix_oferta, parcelado_oferta, recorrente_oferta, oferta_inicio, oferta_fim',
    )
    .single<ConfiguracaoPrecos>()
  if (error || !config) return [{ ok: false, erro: 'falha' }, 500]
  const preco = precoPedido(dados.plano, new Date(), config)
  const utms = Object.fromEntries(Object.entries(dados.utms).filter(([, v]) => v))
  const { data: pedido, error: erroPedido } = await servico
    .from('pedidos')
    .insert({
      nome: dados.nome,
      email: dados.email,
      cpf: dados.cpf,
      whatsapp: dados.whatsapp,
      plano: dados.plano,
      valor_centavos: preco.valorCentavos,
      parcelas: preco.parcelas,
      oferta: preco.oferta,
      meses_acesso: preco.mesesAcesso,
      codigo_indicacao: dados.indicacao ?? null,
      utms,
    })
    .select('id')
    .single<{ id: string }>()
  if (erroPedido || !pedido) return [{ ok: false, erro: 'falha' }, 500]
  const p = { id: pedido.id, dados, preco }
  try {
    if (dados.plano === 'pix') return [await pagarPix(p), 200]
    if (dados.plano === 'parcelado') return [await pagarParcelado(p), 200]
    return [await assinar(p), 200]
  } catch (e) {
    await anotarErro(pedido.id, e)
    if (recusaDeDados(e)) return [{ ok: false, pedido: pedido.id, erro: 'dados' }, 200]
    throw e
  }
}

Deno.serve(async (req) => {
  const origem = req.headers.get('origin') ?? ''
  if (!origemPermitida(origem)) return new Response(null, { status: 403 })
  const cors = cabecalhosCors(origem)
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST') return json({ ok: false }, 405, cors)
  const lido = esquemaPedido.safeParse(await req.json().catch(() => null))
  if (!lido.success) return json({ ok: false, erro: 'dados' }, 400, cors)
  try {
    const [corpo, status] = await criar(lido.data)
    return json(corpo, status, cors)
  } catch (e) {
    console.error('criar-pedido', e instanceof Error ? e.message : e)
    return json({ ok: false, erro: 'falha' }, 502, cors)
  }
})
