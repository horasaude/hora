import type { Json } from '@/types/database'

export type Secao = { titulo: string; texto: string }

/** Seções guardadas no banco; o que vier fora do formato vira seção vazia. */
export function lerSecoes(valor: Json): Secao[] {
  if (!Array.isArray(valor)) return []
  return valor.map((s) => {
    const o = (s ?? {}) as Record<string, unknown>
    return { titulo: String(o.titulo ?? ''), texto: String(o.texto ?? '') }
  })
}
