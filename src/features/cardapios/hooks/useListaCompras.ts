import { listaDeCompras } from '@/domain/listaCompras'
import { useCardapios, useIngredientes, useMarcados } from './useCardapios'

/** Cardápio, lista do período (receitas viram ingredientes) e os itens que ela já marcou. */
export function useListaCompras(cardapioId: string, dias: number) {
  const cardapios = useCardapios()
  const c = cardapios.data?.find((x) => x.id === cardapioId)
  const receitas = [
    ...new Set(
      (c?.refeicoes ?? []).flatMap((r) =>
        r.itens.flatMap((i) => (i.opcoes[0]?.tipo === 'receita' ? [i.opcoes[0].ref_id] : [])),
      ),
    ),
  ]
  const ingredientes = useIngredientes(receitas)
  const marcados = useMarcados(cardapioId)
  const lista = c ? listaDeCompras(c.refeicoes, ingredientes.data ?? new Map(), dias) : []
  return {
    cardapios,
    carregando: cardapios.isPending || ingredientes.isPending,
    cardapio: c,
    lista,
    marcados: marcados.data ?? [],
  }
}
