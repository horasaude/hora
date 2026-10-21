import { useState } from 'react'
import { Abas, Carregando, ErroCarregar, Vazio } from '@/components/ui'
import type { LinhaRanking } from '@/domain/engajamento'
import { useMeuPerfil } from '@/features/auth'
import type { Periodo } from '../api/ranking.api'
import { ComoGanhar } from '../components/ComoGanhar'
import { ListaRanking } from '../components/ListaRanking'
import { MinhaPosicao } from '../components/MinhaPosicao'
import { Podio } from '../components/Podio'
import { useRanking, useRetratos } from '../hooks/useRanking'
import { textos } from '../textos'

const ABAS = [
  { id: 'mes', nome: textos.abas.mes },
  { id: 'ano', nome: textos.abas.ano },
] as const

/** Lista a partir do 4º lugar, com a foto de perfil de quem tem. */
function DoQuartoEmDiante({ linhas }: { linhas: LinhaRanking[] }) {
  const resto = linhas.filter((l) => l.posicao > 3)
  const fotos = useRetratos(resto.map((l) => l.avatar_path)).data
  if (resto.length === 0) return null
  return (
    <ListaRanking
      rotulo={textos.titulo}
      linhas={resto.map((l) => ({
        ...l,
        valor: l.pontos.toLocaleString('pt-BR'),
        foto: (l.avatar_path && fotos?.get(l.avatar_path)) || null,
      }))}
    />
  )
}

/** Ranking do mês e do ano por apelido: pódio, a lista com a linha dela e como ganhar pontos. */
export function RankingPage() {
  const [periodo, setPeriodo] = useState<Periodo>('mes')
  const ranking = useRanking(periodo)
  const perfil = useMeuPerfil()
  const linhas = ranking.data ?? []
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <h1 className="text-[28px] leading-tight font-bold text-verde-escuro max-lg:sr-only lg:text-[30px]">
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
        <div className="flex flex-col gap-4">
          <Podio linhas={linhas} periodo={periodo} />
          <MinhaPosicao linhas={linhas} oculta={Boolean(perfil.data?.ocultar_ranking)} />
          <DoQuartoEmDiante linhas={linhas} />
          <p className="text-center text-[12px] text-suave">{textos.rodape}</p>
        </div>
      )}
      <ComoGanhar />
    </section>
  )
}
