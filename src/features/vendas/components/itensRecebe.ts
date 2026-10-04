import type { ItemRecebe } from '../textos'

/** Itens visíveis: o 13º mês só na oferta do ORA; a loja parceira só com a flag ligada. */
export function itensVisiveis(
  itens: ItemRecebe[],
  emOferta: boolean,
  lojaParceira: boolean,
): ItemRecebe[] {
  return itens.filter(
    (i) => (i.so !== 'oferta' || emOferta) && (i.so !== 'lojaParceira' || lojaParceira),
  )
}
