import { useDeferredValue } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { buscarAlimentosParaEscolha, POR_LEVA, type AlimentoComMedidas } from '../api/alimentos.api'
import { listarReceitas, type ReceitaCompleta } from '../api/receitas.api'
import { porcaoDaReceita } from '../opcoes'
import { tEscolher as t } from '../textos2'

export type Fonte = 'todas' | 'taco' | 'proprio' | 'receitas'
export type Escolhido =
  { tipo: 'alimento'; a: AlimentoComMedidas } | { tipo: 'receita'; r: ReceitaCompleta }

/** Busca alimentos (TACO e próprios) e receitas conforme a fonte. */
function useResultados(fonte: Fonte, busca: string) {
  const termo = useDeferredValue(busca)
  const alimentos = useInfiniteQuery({
    queryKey: ['escolha-alimentos', fonte, termo],
    queryFn: ({ pageParam }) =>
      buscarAlimentosParaEscolha(
        termo,
        fonte === 'taco' || fonte === 'proprio' ? fonte : undefined,
        pageParam,
      ),
    initialPageParam: 0,
    getNextPageParam: (ultima, todas) => (ultima.length === POR_LEVA ? todas.length : undefined),
    enabled: fonte !== 'receitas',
  })
  const receitas = useQuery({
    queryKey: ['escolha-receitas', termo],
    queryFn: () => listarReceitas(termo, ''),
    enabled: fonte === 'todas' || fonte === 'receitas',
  })
  const lista: Escolhido[] = [
    ...(fonte === 'todas' || fonte === 'receitas'
      ? (receitas.data ?? []).map((r) => ({ tipo: 'receita' as const, r }))
      : []),
    ...(fonte !== 'receitas'
      ? (alimentos.data?.pages.flat() ?? []).map((a) => ({ tipo: 'alimento' as const, a }))
      : []),
  ]
  const maisAlimentos = () => {
    if (alimentos.hasNextPage && !alimentos.isFetchingNextPage) void alimentos.fetchNextPage()
  }
  return {
    lista,
    carregando: alimentos.isFetching || receitas.isFetching,
    buscandoMais: alimentos.isFetchingNextPage,
    maisAlimentos,
  }
}

const nome = (e: Escolhido) => (e.tipo === 'alimento' ? e.a.nome : e.r.nome)
const chave = (e: Escolhido) => (e.tipo === 'alimento' ? e.a.id : e.r.id)
const kcal = (e: Escolhido) =>
  e.tipo === 'alimento'
    ? `${Math.round(e.a.kcal ?? 0)} kcal/100 g`
    : `${Math.round(porcaoDaReceita(e.r).kcal)} kcal/porção`

type Props = {
  fonte: Fonte
  busca: string
  escolhido?: Escolhido
  aoEscolher: (e: Escolhido) => void
}

/** Lista de resultados para escolher (todos os alimentos, carregando mais ao rolar); o escolhido fica destacado. */
export function Resultados({ fonte, busca, escolhido, aoEscolher }: Props) {
  const { lista, carregando, buscandoMais, maisAlimentos } = useResultados(fonte, busca)
  return (
    <ul
      className="flex max-h-[46vh] flex-col overflow-y-auto rounded-xl border border-[#ECEFED]"
      aria-busy={carregando}
      onScroll={(e) => {
        const el = e.currentTarget
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) maisAlimentos()
      }}
    >
      {lista.map((e) => (
        <li key={chave(e)} className="border-b border-[#F4F5F4] last:border-b-0">
          <button
            type="button"
            aria-pressed={escolhido ? chave(escolhido) === chave(e) : false}
            onClick={() => aoEscolher(e)}
            className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[13px] ${escolhido && chave(escolhido) === chave(e) ? 'bg-[#F3F8F5]' : 'hover:bg-[#F8FAF9]'}`}
          >
            <span className="min-w-0">
              <span className="block font-bold text-tinta">{nome(e)}</span>
              <span className="block text-xs text-suave">
                {e.tipo === 'receita'
                  ? t.receita
                  : e.a.origem === 'taco'
                    ? t.fontes.taco
                    : t.fontes.proprio}
              </span>
            </span>
            <span className="shrink-0 text-xs text-suave">{kcal(e)}</span>
          </button>
        </li>
      ))}
      {buscandoMais && (
        <li role="status" className="px-3.5 py-2.5 text-xs text-suave">
          {t.carregandoMais}
        </li>
      )}
    </ul>
  )
}
