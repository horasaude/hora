import { useDeferredValue } from 'react'
import { useQuery } from '@tanstack/react-query'
import { buscarAlimentosParaEscolha, type AlimentoComMedidas } from '../api/alimentos.api'
import { listarReceitas, type ReceitaCompleta } from '../api/receitas.api'
import { porcaoDaReceita } from '../opcoes'
import { tEscolher as t } from '../textos2'

export type Fonte = 'todas' | 'taco' | 'proprio' | 'receitas'
export type Escolhido =
  { tipo: 'alimento'; a: AlimentoComMedidas } | { tipo: 'receita'; r: ReceitaCompleta }

/** Busca alimentos (TACO e próprios) e receitas conforme a fonte. */
function useResultados(fonte: Fonte, busca: string) {
  const termo = useDeferredValue(busca)
  const alimentos = useQuery({
    queryKey: ['escolha-alimentos', fonte, termo],
    queryFn: () =>
      buscarAlimentosParaEscolha(
        termo,
        fonte === 'taco' || fonte === 'proprio' ? fonte : undefined,
      ),
    enabled: fonte !== 'receitas',
  })
  const receitas = useQuery({
    queryKey: ['escolha-receitas', termo],
    queryFn: () => listarReceitas(termo, ''),
    enabled: fonte === 'todas' || fonte === 'receitas',
  })
  const lista: Escolhido[] = [
    ...(fonte !== 'receitas'
      ? (alimentos.data ?? []).map((a) => ({ tipo: 'alimento' as const, a }))
      : []),
    ...(fonte === 'todas' || fonte === 'receitas'
      ? (receitas.data ?? []).map((r) => ({ tipo: 'receita' as const, r }))
      : []),
  ]
  return { lista, carregando: alimentos.isFetching || receitas.isFetching }
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

/** Lista de resultados para escolher; o escolhido fica destacado. */
export function Resultados({ fonte, busca, escolhido, aoEscolher }: Props) {
  const { lista, carregando } = useResultados(fonte, busca)
  return (
    <ul
      className="flex max-h-[46vh] flex-col overflow-y-auto rounded-xl border border-[#ECEFED]"
      aria-busy={carregando}
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
    </ul>
  )
}
