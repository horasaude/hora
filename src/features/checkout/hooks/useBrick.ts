import { useCallback, useEffect, useRef, useState } from 'react'
import type { Plano } from '@/domain/precos'
import { bricks, cartaoDoBrick, chavePublicaMp, type ControleBrick } from '@/lib/mercadopago'
import { ajustesBrick } from '../components/brick'

export const ID_BRICK = 'pagamento-mp'

export type EstadoBrick = 'carregando' | 'pronto' | 'erro' | 'sem_chave'

/** Monta o Payment Brick em #pagamento-mp e remonta quando o plano ou o valor mudam. */
export function useBrick(plano: Plano, centavos: number, email: string, ativo = true) {
  const chave = chavePublicaMp()
  const versao = `${plano}:${centavos}:${ativo}`
  const [pronto, setPronto] = useState<string | null>(null)
  const [falhou, setFalhou] = useState<string | null>(null)
  const controle = useRef<ControleBrick | null>(null)
  const [emailInicial] = useState(email)
  const estado: EstadoBrick = !chave
    ? 'sem_chave'
    : falhou === versao
      ? 'erro'
      : pronto === versao
        ? 'pronto'
        : 'carregando'

  useEffect(() => {
    if (!chave || !ativo) return
    let vivo = true
    const v = `${plano}:${centavos}:${ativo}`
    bricks(chave)
      .then((b) =>
        b.create('payment', ID_BRICK, {
          ...ajustesBrick(plano, centavos, emailInicial),
          callbacks: {
            onReady: () => vivo && setPronto(v),
            onError: (e: { type?: string }) => vivo && e.type === 'critical' && setFalhou(v),
          },
        }),
      )
      .then((c) => {
        if (vivo) controle.current = c
        else c.unmount()
      })
      .catch(() => vivo && setFalhou(v))
    return () => {
      vivo = false
      try {
        controle.current?.unmount()
      } catch {
        // o quadro já saiu da tela
      }
      controle.current = null
    }
  }, [chave, plano, centavos, emailInicial, ativo])

  const cartao = useCallback(
    async () => (controle.current ? cartaoDoBrick(controle.current) : null),
    [],
  )
  return { estado, cartao }
}
