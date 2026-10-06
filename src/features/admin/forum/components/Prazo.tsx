import { useState } from 'react'
import { EtiquetaBrilho } from '@/components/ui'
import { prazoDaDuvida } from '@/domain/forum'
import type { ItemFila } from '../api/forum.api'
import { t } from '../textos'

/** Tempo restante (verde, dourado, coral); respondida em verde e oculta em cinza. */
export function Prazo({ d }: { d: Pick<ItemFila, 'prazo_em' | 'respondida_em' | 'oculto_em'> }) {
  const [agora] = useState(() => new Date())
  if (d.oculto_em) return <EtiquetaBrilho tom="cinza">{t.oculta}</EtiquetaBrilho>
  if (d.respondida_em) return <EtiquetaBrilho tom="verde">{t.respondida}</EtiquetaBrilho>
  const p = prazoDaDuvida(new Date(d.prazo_em), agora)
  return <EtiquetaBrilho tom={p.tom}>{p.texto}</EtiquetaBrilho>
}
