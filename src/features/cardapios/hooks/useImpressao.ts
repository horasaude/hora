import { useQuery } from '@tanstack/react-query'
import type { Refeicao } from '@/domain/nutricao'
import { receitasParaImpressao } from '../api/receitas.api'

/** Ids das receitas usadas nas refeições e nas substitutas, sem repetir. */
export function idsDeReceitas(refeicoes: Refeicao[]): string[] {
  const itens = refeicoes.flatMap((r) => [...r.itens, ...r.substitutas.flatMap((s) => s.itens)])
  return [
    ...new Set(
      itens.flatMap((i) => i.opcoes.filter((o) => o.tipo === 'receita').map((o) => o.ref_id)),
    ),
  ]
}

/** Receitas do cardápio para a impressão (busca só quando há alguma). */
export function useReceitasImpressao(refeicoes: Refeicao[]) {
  const ids = idsDeReceitas(refeicoes)
  return useQuery({
    queryKey: ['receitas-impressao', ids],
    queryFn: () => receitasParaImpressao(ids),
    enabled: ids.length > 0,
    staleTime: 10 * 60_000,
  }).data
}
