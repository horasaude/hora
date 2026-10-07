import { useState } from 'react'
import { Abas, Carregando, ErroCarregar, Vazio } from '@/components/ui'
import { useMeuPerfil } from '@/features/auth'
import type { Periodo } from '../api/ranking.api'
import { ListaRanking } from '../components/ListaRanking'
import { MinhaPosicao } from '../components/MinhaPosicao'
import { useRanking } from '../hooks/useRanking'
import { textos } from '../textos'

const ABAS = [
  { id: 'mes', nome: textos.abas.mes },
  { id: 'ano', nome: textos.abas.ano },
] as const

/** Ranking do mês e do ano por apelido, com a posição dela no topo. */
export function RankingPage() {
  const [periodo, setPeriodo] = useState<Periodo>('mes')
  const ranking = useRanking(periodo)
  const perfil = useMeuPerfil()
  const linhas = ranking.data ?? []
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
        {textos.titulo}
      </h1>
      <Abas opcoes={ABAS} ativa={periodo} aoEscolher={setPeriodo} rotulo={textos.abasRotulo} />
      {ranking.isPending ? (
        <Carregando texto={textos.carregando} />
      ) : ranking.isError ? (
        <ErroCarregar
          texto={textos.erro}
          tentar={textos.tentar}
          aoTentar={() => ranking.refetch()}
        />
      ) : linhas.every((l) => l.pontos === 0) ? (
        <Vazio>{textos.vazio}</Vazio>
      ) : (
        <div className="flex flex-col gap-5 lg:gap-6">
          <MinhaPosicao
            linhas={linhas}
            periodo={periodo}
            oculta={Boolean(perfil.data?.ocultar_ranking)}
          />
          <div className="flex flex-col gap-4">
            <ListaRanking
              rotulo={textos.titulo}
              linhas={linhas.map((l) => ({ ...l, valor: l.pontos.toLocaleString('pt-BR') }))}
            />
            <p className="brilho brilho-cinza self-center rounded-full px-4 py-2 text-center text-[13px] font-bold">
              {textos.rodape}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
