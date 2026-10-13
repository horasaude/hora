import { useState, type ReactNode } from 'react'
import { classeBrilho } from '@/components/ui'
import { Estado } from '../../components/Estado'
import { QuadroTreinos } from '../components/QuadroTreinos'
import { RotinaJanela } from '../components/RotinaJanela'
import { TabelaModelos } from '../components/TabelaModelos'
import { useRotinas } from '../hooks/useTreinosPainel'
import { t } from '../textos'

/** Modelos: rotinas semanais que agrupam treinos (a aluna vê a do tema e do nível dela). */
export function ModelosPage() {
  const lista = useRotinas()
  const [novo, setNovo] = useState(false)
  const botao = (
    <button type="button" className={classeBrilho('verde')} onClick={() => setNovo(true)}>
      {t.novoModelo}
    </button>
  )
  let corpo: ReactNode
  if (lista.isPending) corpo = <Estado tipo="carregando" />
  else if (lista.isError) corpo = <Estado tipo="erro" tentar={() => lista.refetch()} />
  else if (lista.data.length === 0)
    corpo = <Estado tipo="vazio" texto={t.vazioModelos} acao={botao} />
  else corpo = <TabelaModelos rotinas={lista.data} />
  return (
    <QuadroTreinos acao={botao}>
      {corpo}
      {novo && <RotinaJanela aoFechar={() => setNovo(false)} />}
    </QuadroTreinos>
  )
}
