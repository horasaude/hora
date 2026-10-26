// Cria o pedido do checkout e a cobrança no Asaas: Pix na tela, cartão de 1x a 12x ou assinatura
// mensal. O cartão é digitado no nosso checkout e segue direto para o Asaas, sem ser gravado.
// O preço é decidido aqui, pela tabela configuracoes; o acesso só é liberado pelo webhook.
import { cabecalhosCors, origemPermitida } from '../_shared/cors.ts'
import {
  aplicarCupom,
  precoPedido,
  type ConfiguracaoPrecos,
  type CupomPedido,
  type PrecoPedido,
} from '../_shared/pagamento/regras.ts'
import { json, servico } from '../_shared/servico.ts'
import { esquemaPedido, type EntradaPedido } from './entrada.ts'
import {
  anotarErro,
  assinar,
  pagarParcelado,
  motivoRecusa,
  pagarPix,
  type Resultado,
} from './pagar.ts'

/** Cupom digitado: confere no banco (ativo, no prazo, com uso livre) e se vale para o plano. */
async function buscarCupom(dados: EntradaPedido): Promise<CupomPedido | null | 'invalido'> {
  if (!dados.cupom) return null
  const { data } = await servico.rpc('consultar_cupom', { p_codigo: dados.cupom })
  const c = (data as CupomPedido[] | null)?.[0]
  return c && c.planos.includes(dados.plano) ? c : 'invalido'
}

const comCupom = (preco: PrecoPedido, c: CupomPedido | null) =>
  c ? { ...preco, valorCentavos: aplicarCupom(preco.valorCentavos, c) } : preco

async function criar(dados: EntradaPedido, ip: string, ua: string): Promise<[Resultado, number]> {
  const { data: config, error } = await servico
    .from('configuracoes')
    .select(
      'pix_cheio, parcelado_cheio, recorrente_cheio, pix_oferta, parcelado_oferta, recorrente_oferta, oferta_inicio, oferta_fim',
    )
    .single<ConfiguracaoPrecos>()
  if (error || !config) return [{ ok: false, erro: 'falha' }, 500]
  const cupom = await buscarCupom(dados)
  if (cupom === 'invalido') return [{ ok: false, erro: 'cupom' }, 200]
  const base = precoPedido(dados.plano, new Date(), config)
  const preco = comCupom(
    dados.plano === 'parcelado' ? { ...base, parcelas: dados.parcelas ?? base.parcelas } : base,
    cupom,
  )
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
      cupom_id: cupom?.id ?? null,
      desconto_centavos: base.valorCentavos - preco.valorCentavos,
      utms,
      rastreio: { ...dados.rastreio, ip, ua: ua.slice(0, 400) },
    })
    .select('id')
    .single<{ id: string }>()
  if (erroPedido || !pedido) return [{ ok: false, erro: 'falha' }, 500]
  const p = { id: pedido.id, dados, preco, ip }
  try {
    if (dados.plano === 'pix') return [await pagarPix(p), 200]
    if (dados.plano === 'parcelado') return [await pagarParcelado(p), 200]
    return [await assinar(p), 200]
  } catch (e) {
    await anotarErro(pedido.id, e)
    const motivo = motivoRecusa(e)
    if (motivo) return [{ ok: false, pedido: pedido.id, erro: motivo }, 200]
    throw e
  }
}

/** IP de quem está comprando (o primeiro da lista, posto pelo proxy do Supabase). */
const ipDe = (req: Request) =>
  (req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '').split(',')[0].trim()

Deno.serve(async (req) => {
  const origem = req.headers.get('origin') ?? ''
  if (!origemPermitida(origem)) return new Response(null, { status: 403 })
  const cors = cabecalhosCors(origem)
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST') return json({ ok: false }, 405, cors)
  const lido = esquemaPedido.safeParse(await req.json().catch(() => null))
  if (!lido.success) {
    // Só o nome dos campos recusados, nunca os valores (o cartão pode estar no corpo).
    const campos = [...new Set(lido.error.issues.map((i) => i.path.join('.') || 'corpo'))]
    console.error('criar-pedido entrada recusada:', campos.join(', '))
    return json({ ok: false, erro: 'dados' }, 400, cors)
  }
  try {
    const [corpo, status] = await criar(lido.data, ipDe(req), req.headers.get('user-agent') ?? '')
    return json(corpo, status, cors)
  } catch (e) {
    console.error('criar-pedido', e instanceof Error ? e.message : e)
    return json({ ok: false, erro: 'falha' }, 502, cors)
  }
})
