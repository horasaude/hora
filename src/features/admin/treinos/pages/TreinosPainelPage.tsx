import { useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { classeBrilho } from '@/components/ui'
import { Estado } from '../../components/Estado'
import { QuadroTreinos } from '../components/QuadroTreinos'
import { TabelaTreinos } from '../components/TabelaTreinos'
import { TreinoJanela } from '../components/TreinoJanela'
import { useTreinosPainel } from '../hooks/useTreinosPainel'
import { t } from '../textos'

/** Treinos: lista com status e o botão principal "+ Novo treino" (/treinos/novo abre a janela). */
export function TreinosPainelPage() {
  const lista = useTreinosPainel()
  const navegar = useNavigate()
  const novoNoEndereco = useLocation().pathname.endsWith('/novo')
  const [novo, setNovo] = useState(false)
  const botao = (
    <button type="button" className={classeBrilho('verde')} onClick={() => setNovo(true)}>
      {t.novoTreino}
    </button>
  )
  let corpo: ReactNode
  if (lista.isPending) corpo = <Estado tipo="carregando" />
  else if (lista.isError) corpo = <Estado tipo="erro" tentar={() => lista.refetch()} />
  else if (lista.data.length === 0)
    corpo = <Estado tipo="vazio" texto={t.vazioTreinos} acao={botao} />
  else corpo = <TabelaTreinos treinos={lista.data} />
  return (
    <QuadroTreinos acao={botao}>
      {corpo}
      {(novo || novoNoEndereco) && (
        <TreinoJanela
          aoFechar={() => {
            setNovo(false)
            if (novoNoEndereco) navegar('/app/admin/treinos')
          }}
        />
      )}
    </QuadroTreinos>
  )
}
