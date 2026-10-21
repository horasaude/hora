import { useState, type ReactNode } from 'react'
import { classeBrilho } from '@/components/ui'
import { Estado } from '../../components/Estado'
import { useTemas } from '../../hooks/usePainel'
import type { Rotina } from '../api/treinos.api'
import { QuadroTreinos } from '../components/QuadroTreinos'
import { RotinaJanela } from '../components/RotinaJanela'
import { TabelaModelos } from '../components/TabelaModelos'
import { useRotinas } from '../hooks/useTreinosPainel'
import { t } from '../textos'

type Novo = { tema?: string } | null

/** Tipos de treino agrupados por tema: cada tema pode ter vários (ex.: Emagrecimento e Hipertrofia). */
function PorTema({ rotinas, criar }: { rotinas: Rotina[]; criar: (tema: string) => void }) {
  const temas = useTemas().data ?? []
  const grupos = temas
    .map((tema) => ({ tema, lista: rotinas.filter((r) => r.tema_id === tema.id) }))
    .filter((g) => g.lista.length > 0)
  return (
    <div className="flex flex-col gap-6">
      {grupos.map(({ tema, lista }) => (
        <section key={tema.id} className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[17px] font-bold text-verde-escuro">
              {tema.titulo}
              <span className="ml-2 text-[13px] font-normal text-suave">
                {t.tiposNoTema(lista.length)}
              </span>
            </h2>
            <button
              type="button"
              className={classeBrilho('dourado', 'sm')}
              onClick={() => criar(tema.id)}
            >
              {t.novoNoTema}
            </button>
          </div>
          <TabelaModelos rotinas={lista} />
        </section>
      ))}
    </div>
  )
}

/** Tipos de treino (rotinas): a aluna escolhe entre os do tema e vê a semana de cada um. */
export function ModelosPage() {
  const lista = useRotinas()
  const [novo, setNovo] = useState<Novo>(null)
  const botao = (
    <button type="button" className={classeBrilho('verde')} onClick={() => setNovo({})}>
      {t.novoModelo}
    </button>
  )
  let corpo: ReactNode
  if (lista.isPending) corpo = <Estado tipo="carregando" />
  else if (lista.isError) corpo = <Estado tipo="erro" tentar={() => lista.refetch()} />
  else if (lista.data.length === 0)
    corpo = <Estado tipo="vazio" texto={t.vazioModelos} acao={botao} />
  else corpo = <PorTema rotinas={lista.data} criar={(tema) => setNovo({ tema })} />
  return (
    <QuadroTreinos acao={botao}>
      {corpo}
      {novo && <RotinaJanela temaId={novo.tema} aoFechar={() => setNovo(null)} />}
    </QuadroTreinos>
  )
}
