import { useState } from 'react'
import type { Plano } from '@/domain/precos'
import { indicacaoGuardada } from '@/lib/indicacao'
import { soDigitos } from '@/lib/telefone'
import { utmsGuardadas } from '@/lib/utm'
import { criarPedido, type Pix } from '../api/pedido.api'
import type { DadosCheckout } from '../schemas/checkout'
import { textos } from '../textos'

/** Guarda o plano em que aconteceu: trocar de plano esconde o Pix e volta ao pagamento. */
export type Resultado = { plano: Plano; tipo: 'pix'; pedido: string; pix: Pix }

export const irParaObrigada = (pedido: string) =>
  window.location.assign(`/obrigada?pedido=${pedido}`)

/** Página segura do Asaas para digitar o cartão; de lá ela volta para /obrigada. */
export const irParaPagamento = (url: string) => window.location.assign(url)

/** Envia o pedido: Pix devolve o QR na tela; cartão vai para a página de pagamento do Asaas. */
export function useFinalizar(plano: Plano) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  async function finalizar(d: DadosCheckout) {
    setErro(null)
    setEnviando(true)
    const r = await criarPedido({
      plano: d.plano,
      nome: d.nome,
      email: d.email,
      cpf: soDigitos(d.cpf),
      whatsapp: soDigitos(d.whatsapp),
      indicacao: indicacaoGuardada(),
      utms: utmsGuardadas(),
    })
    if (r.pagar_url) return irParaPagamento(r.pagar_url)
    setEnviando(false)
    if (r.pix && r.pedido)
      return setResultado({ plano: d.plano, tipo: 'pix', pedido: r.pedido, pix: r.pix })
    setErro(r.erro === 'dados' ? textos.pagamento.dados : textos.pagamento.falha)
  }

  const atual = resultado?.plano === plano ? resultado : null
  return { finalizar, enviando, erro, resultado: atual, recomecar: () => setResultado(null) }
}
