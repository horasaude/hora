import { useEffect, useState } from 'react'
import { pedidoValido, situacaoPedido, type SituacaoPedido } from '@/lib/pedido'
import { eventoMeta } from '@/lib/pixelMeta'

export type Fase = 'sem_pedido' | 'pendente' | 'aprovado' | 'recusado'

const CONSULTA_MS = 5000
const LIMITE = 360

function fase(status: string | undefined): Fase {
  if (status === 'aprovado') return 'aprovado'
  if (status === 'criado' || status === 'pendente') return 'pendente'
  if (status === 'recusado' || status === 'cancelado') return 'recusado'
  return 'sem_pedido'
}

/** Compra aprovada vai uma vez só por pedido ao pixel, com o valor (o id do pedido evita contar em dobro). */
function contarCompra(id: string, s: SituacaoPedido) {
  const chave = `ora:compra:${id}`
  try {
    if (sessionStorage.getItem(chave)) return
    sessionStorage.setItem(chave, '1')
  } catch {
    // segue e conta
  }
  eventoMeta(
    'Purchase',
    { value: s.valor_centavos / 100, currency: 'BRL', content_name: s.plano },
    id,
  )
}

/** Situação real do pedido de ?pedido=; enquanto pendente, consulta a cada 5 s (até 30 min). */
export function useSituacaoPedido(): Fase {
  const [id] = useState(() => new URLSearchParams(window.location.search).get('pedido'))
  const [atual, setAtual] = useState<Fase>(pedidoValido(id) ? 'pendente' : 'sem_pedido')

  useEffect(() => eventoMeta('PageView'), [])
  useEffect(() => {
    if (!pedidoValido(id)) return
    let vivo = true
    let vezes = 0
    async function consultar() {
      const s = await situacaoPedido(id as string).catch(() => undefined)
      if (!vivo) return
      if (s !== undefined) setAtual(fase(s?.status))
      if (s && fase(s.status) === 'aprovado') contarCompra(id as string, s)
      if ((s === undefined || fase(s?.status) === 'pendente') && ++vezes < LIMITE)
        timer = window.setTimeout(consultar, CONSULTA_MS)
    }
    let timer = window.setTimeout(consultar, 0)
    return () => {
      vivo = false
      window.clearTimeout(timer)
    }
  }, [id])

  return atual
}
