import { useState } from 'react'
import type { Plano } from '@/domain/precos'
import { lerValidade } from '@/lib/cartao'
import { indicacaoGuardada } from '@/lib/indicacao'
import { soDigitos } from '@/lib/telefone'
import { rastreioMeta } from '@/lib/pixelMeta'
import { utmsGuardadas } from '@/lib/utm'
import { criarPedido, type CartaoPedido, type Pix } from '../api/pedido.api'
import type { DadosCheckout } from '../schemas/checkout'
import { textos } from '../textos'

/** Guarda o plano em que aconteceu: trocar de plano esconde o Pix e volta ao pagamento. */
export type Resultado = { plano: Plano; tipo: 'pix'; pedido: string; pix: Pix }

export const irParaObrigada = (pedido: string) =>
  window.location.assign(`/obrigada?pedido=${pedido}`)

/** Cartão no formato do servidor. Só existe na memória até o envio. */
function cartaoDe(d: DadosCheckout): CartaoPedido {
  const v = lerValidade(d.validade) ?? { mes: 0, ano: 0 }
  return {
    numero: soDigitos(d.numeroCartao),
    nome: d.nomeCartao.trim(),
    mes: v.mes,
    ano: v.ano,
    cvv: d.cvv,
    cep: soDigitos(d.cep),
    numero_casa: d.numeroCasa.trim(),
  }
}

const ERROS: Record<string, string> = {
  cartao: textos.pagamento.recusado,
  cep: textos.pagamento.cep,
  dados: textos.pagamento.dados,
}

/** Envia o pedido: Pix devolve o QR na tela; cartão aprovado ou em análise vai para /obrigada. */
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
      rastreio: rastreioMeta(),
      ...(d.plano !== 'pix' && { cartao: cartaoDe(d) }),
      ...(d.plano === 'parcelado' && { parcelas: d.parcelas }),
    })
    if (r.ok && r.pedido && !r.pix) return irParaObrigada(r.pedido)
    setEnviando(false)
    if (r.pix && r.pedido)
      return setResultado({ plano: d.plano, tipo: 'pix', pedido: r.pedido, pix: r.pix })
    setErro(ERROS[r.erro ?? ''] ?? textos.pagamento.falha)
  }

  const atual = resultado?.plano === plano ? resultado : null
  return { finalizar, enviando, erro, resultado: atual, recomecar: () => setResultado(null) }
}
