import { useEffect, useState } from 'react'
import { FIM_OFERTA_ORA, ofertaOraDisponivel } from '@/domain/oferta'

const MAIOR_ESPERA = 2_147_483_647

/** true até FIM_OFERTA_ORA; vira false sozinho no instante do fim, sem relógio de segundo em segundo. */
export function useEmOferta(): boolean {
  const [emOferta, setEmOferta] = useState(() => ofertaOraDisponivel(new Date()))
  const [voltas, setVoltas] = useState(0)
  useEffect(() => {
    if (!emOferta) return
    const falta = FIM_OFERTA_ORA.getTime() - Date.now() + 1000
    const id = window.setTimeout(
      () => (ofertaOraDisponivel(new Date()) ? setVoltas((v) => v + 1) : setEmOferta(false)),
      Math.min(Math.max(falta, 0), MAIOR_ESPERA),
    )
    return () => window.clearTimeout(id)
  }, [emOferta, voltas])
  return emOferta
}
