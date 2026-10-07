import { useEffect, useState } from 'react'
import { situacaoPedido } from '@/lib/pedido'

const CONSULTA_MS = 5000

/** Contagem até expirar e consulta da situação a cada 5 s; chama aoAprovar uma vez. */
export function usePixPendente(pedido: string, expiraEm: string, aoAprovar: () => void) {
  const fim = new Date(expiraEm).getTime()
  const [restante, setRestante] = useState(() => Math.max(0, fim - Date.now()))

  useEffect(() => {
    const id = window.setInterval(() => setRestante(Math.max(0, fim - Date.now())), 1000)
    return () => window.clearInterval(id)
  }, [fim])

  useEffect(() => {
    let vivo = true
    const id = window.setInterval(async () => {
      const s = await situacaoPedido(pedido).catch(() => null)
      if (vivo && s?.status === 'aprovado') {
        vivo = false
        aoAprovar()
      }
    }, CONSULTA_MS)
    return () => {
      vivo = false
      window.clearInterval(id)
    }
  }, [pedido, aoAprovar])

  const total = Math.ceil(restante / 1000)
  const tempo = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
  return { tempo, expirou: restante <= 0 }
}
