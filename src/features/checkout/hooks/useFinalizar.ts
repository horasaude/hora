import { useState } from 'react'
import type { Plano } from '@/domain/precos'
import type { DadosCartao } from '@/lib/mercadopago'
import { indicacaoGuardada } from '@/lib/indicacao'
import { soDigitos } from '@/lib/telefone'
import { utmsGuardadas } from '@/lib/utm'
import { criarPedido, type Motivo, type Pix } from '../api/pedido.api'
import type { DadosCheckout } from '../schemas/checkout'
import { textos } from '../textos'

/** Guarda o plano em que aconteceu: trocar de plano esconde o resultado e volta ao pagamento. */
export type Resultado = { plano: Plano } & (
  { tipo: 'pix'; pedido: string; pix: Pix } | { tipo: 'recusado'; motivo: Motivo }
)

export const irParaObrigada = (pedido: string) =>
  window.location.assign(`/obrigada?pedido=${pedido}`)

/** Envia o pedido: Pix devolve o QR na tela; cartão vai para /obrigada ou mostra a recusa. */
export function useFinalizar(cartao: { current: () => Promise<DadosCartao | null> }, plano: Plano) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  async function finalizar(d: DadosCheckout) {
    setErro(null)
    setEnviando(true)
    const dadosCartao = d.plano === 'pix' ? undefined : await cartao.current().catch(() => null)
    if (d.plano !== 'pix' && !dadosCartao) {
      setEnviando(false)
      return setErro(textos.pagamento.confiraCartao)
    }
    const r = await criarPedido({
      plano: d.plano,
      nome: d.nome,
      email: d.email,
      cpf: soDigitos(d.cpf),
      whatsapp: soDigitos(d.whatsapp),
      indicacao: indicacaoGuardada(),
      utms: utmsGuardadas(),
      cartao: dadosCartao ?? undefined,
    })
    setEnviando(false)
    if (r.pix && r.pedido)
      return setResultado({ plano: d.plano, tipo: 'pix', pedido: r.pedido, pix: r.pix })
    if (r.status === 'recusado')
      return setResultado({ plano: d.plano, tipo: 'recusado', motivo: r.motivo ?? 'outro' })
    if (r.ok && r.pedido) return irParaObrigada(r.pedido)
    setErro(textos.pagamento.falha)
  }

  const atual = resultado?.plano === plano ? resultado : null
  return { finalizar, enviando, erro, resultado: atual, recomecar: () => setResultado(null) }
}
