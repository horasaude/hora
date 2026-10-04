import { precosPara, type Precos } from '@/domain/precos'
import { useEmOferta } from './useEmOferta'

/** Preços vigentes; trocam sozinhos no fim da oferta do ORA. */
export function usePrecos(): Precos {
  return precosPara(useEmOferta())
}
