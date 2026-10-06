import { useEffect, useState } from 'react'
import { estadoOferta, type EstadoOferta } from '@/domain/oferta'
import { useConfiguracao } from '@/features/configuracao'

const MAIOR_ESPERA = 2_147_483_647

/** Estado da oferta do ORA; muda sozinho na virada para 24/10 e no fim do dia, sem relógio de segundo em segundo. */
export function useEstadoOferta(): EstadoOferta {
  const config = useConfiguracao()
  const [agora, setAgora] = useState(() => new Date())
  const estado = estadoOferta(agora, config)
  useEffect(() => {
    if (estado === 'depois') return
    const alvo = estado === 'antes' ? config.ofertaInicio : config.ofertaFim
    const falta = alvo.getTime() - Date.now() + 1000
    const id = window.setTimeout(
      () => setAgora(new Date()),
      Math.min(Math.max(falta, 0), MAIOR_ESPERA),
    )
    return () => window.clearTimeout(id)
  }, [estado, agora, config])
  return estado
}

/** true só no dia da oferta (24/10). */
export function useEmOferta(): boolean {
  return useEstadoOferta() === 'durante'
}
