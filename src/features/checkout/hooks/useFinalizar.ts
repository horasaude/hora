import { useState } from 'react'
import type { DadosCartao } from '@/lib/mercadopago'
import { indicacaoGuardada } from '@/lib/indicacao'
import { soDigitos } from '@/lib/telefone'
import { utmsGuardadas } from '@/lib/utm'
import { criarPedido, type Motivo, type Pix } from '../api/pedido.api'
import type { DadosCheckout } from '../schemas/checkout'
import { textos } from '../textos'

export type Resultado =
  { tipo: 'pix'; pedido: string; pix: Pix } | { tipo: 'recusado'; motivo: Motivo }

export const irParaObrigada = (pedido: string) =>
  window.location.assign(`/obrigada?pedido=${pedido}`)

/** Envia o pedido: Pix devolve o QR na tela; cartão vai para /obrigada ou mostra a recusa. */
export function useFinalizar(cartao: () => Promise<DadosCartao | null>) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  async function finalizar(d: DadosCheckout) {
    setErro(null)
    setEnviando(true)
    const dadosCartao = d.plano === 'pix' ? undefined : await cartao().catch(() => null)
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
    if (r.pix && r.pedido) return setResultado({ tipo: 'pix', pedido: r.pedido, pix: r.pix })
    if (r.status === 'recusado')
      return setResultado({ tipo: 'recusado', motivo: r.motivo ?? 'outro' })
    if (r.ok && r.pedido) return irParaObrigada(r.pedido)
    setErro(textos.pagamento.falha)
  }

  return { finalizar, enviando, erro, resultado, recomecar: () => setResultado(null) }
}
