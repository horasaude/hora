import { Carregando, Cartao } from '@/components/ui'
import { ListaRanking } from '@/features/ranking'
import { useRankingDesafio } from '../hooks/useDesafios'
import { textos } from '../textos'

/** Ranking do desafio pelo apelido, com os dias cumpridos sobre a meta. */
export function RankingDesafio({ id, meta }: { id: string; meta: number }) {
  const r = useRankingDesafio(id)
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[19px] font-bold text-verde-escuro">{textos.ranking}</h2>
      {r.isPending ? (
        <Carregando texto={textos.carregando} />
      ) : r.isError || !r.data.length ? (
        <Cartao className="text-sm text-suave">
          {r.isError ? textos.erro : textos.semRanking}
        </Cartao>
      ) : (
        <ListaRanking
          rotulo={textos.ranking}
          linhas={r.data.map((l) => ({ ...l, valor: textos.dias(l.dias, meta) }))}
        />
      )}
    </section>
  )
}
