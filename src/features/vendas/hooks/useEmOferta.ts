import { useEffect, useState } from 'react'
import { estadoOferta, FIM_OFERTA_ORA, INICIO_OFERTA_ORA, type EstadoOferta } from '@/domain/oferta'

const MAIOR_ESPERA = 2_147_483_647

/** Estado da oferta do ORA; muda sozinho na virada para 24/10 e no fim do dia, sem relógio de segundo em segundo. */
export function useEstadoOferta(): EstadoOferta {
  const [estado, setEstado] = useState(() => estadoOferta(new Date()))
  const [voltas, setVoltas] = useState(0)
  useEffect(() => {
    if (estado === 'depois') return
    const alvo = estado === 'antes' ? INICIO_OFERTA_ORA : FIM_OFERTA_ORA
    const falta = alvo.getTime() - Date.now() + 1000
    const id = window.setTimeout(
      () => {
        const novo = estadoOferta(new Date())
        if (novo === estado) setVoltas((v) => v + 1)
        else setEstado(novo)
      },
      Math.min(Math.max(falta, 0), MAIOR_ESPERA),
    )
    return () => window.clearTimeout(id)
  }, [estado, voltas])
  return estado
}

/** true só no dia da oferta (24/10). */
export function useEmOferta(): boolean {
  return useEstadoOferta() === 'durante'
}
