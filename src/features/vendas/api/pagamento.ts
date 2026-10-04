import type { Plano } from '@/domain/precos'
import { env } from '@/lib/env'

const LINKS: Record<Plano, string | undefined> = {
  pix: env.VITE_MP_LINK_PIX,
  parcelado: env.VITE_MP_LINK_PARCELADO,
  recorrente: env.VITE_MP_LINK_RECORRENTE,
}

/** Link do Mercado Pago do plano, ou null se a variável não foi configurada na Vercel. */
export function linkPagamento(plano: Plano): string | null {
  return LINKS[plano] ?? null
}
