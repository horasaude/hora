import { useMemo, type ReactNode } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useMeuPerfil } from '@/features/auth'
import { FaixaPrevia } from '../components/FaixaPrevia'
import { ContextoPrevia, type Previa } from '../previa'
import { useTrilha } from '../hooks/useTrilha'
import { AulaPage } from './AulaPage'
import { TrilhaPage } from './TrilhaPage'

function Faixa() {
  const [busca, setBusca] = useSearchParams()
  const trilha = useTrilha()
  const dia = Number(busca.get('dia') ?? 1)
  const tema = busca.get('tema')
  return (
    <FaixaPrevia
      dia={dia}
      tema={tema}
      temas={trilha.data?.temas ?? []}
      aoMudar={(d, t) =>
        setBusca(t ? { dia: String(d), tema: t } : { dia: String(d) }, { replace: true })
      }
    />
  )
}

/** Moldura da pré-visualização: só admin; dia e tema ficam no endereço. */
function ComPrevia({ children }: { children: ReactNode }) {
  const perfil = useMeuPerfil()
  const [busca, setBusca] = useSearchParams()
  const dia = Math.min(365, Math.max(1, Number(busca.get('dia') ?? 1) || 1))
  const tema = busca.get('tema')
  const previa = useMemo<Previa>(
    () => ({
      dia,
      tema,
      sufixo: `?dia=${dia}${tema ? `&tema=${tema}` : ''}`,
      escolherTema: (id) =>
        setBusca({ dia: String(Math.max(dia, 8)), tema: id }, { replace: true }),
    }),
    [dia, tema, setBusca],
  )
  if (perfil.isPending) return null
  if (perfil.data?.papel !== 'admin') return <Navigate to="/app" replace />
  return (
    <ContextoPrevia.Provider value={previa}>
      <Faixa />
      {children}
    </ContextoPrevia.Provider>
  )
}

/** Painel > Ver como aluna: a trilha exatamente como a aluna vê no dia e tema escolhidos. */
export function PreviaPage() {
  return (
    <ComPrevia>
      <TrilhaPage />
    </ComPrevia>
  )
}

export function PreviaAulaPage() {
  return (
    <ComPrevia>
      <AulaPage />
    </ComPrevia>
  )
}
