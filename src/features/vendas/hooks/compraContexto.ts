import { createContext, useContext } from 'react'
import type { Plano } from '@/domain/precos'

export type AbrirCompra = (plano?: Plano) => void

export const CompraContexto = createContext<AbrirCompra>(() => {})

/** Abre o popup de compra. Sem plano, abre com o parcelado marcado (o preço em destaque). */
export function useAbrirCompra(): AbrirCompra {
  return useContext(CompraContexto)
}
