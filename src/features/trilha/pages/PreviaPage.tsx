import { useMemo, type ReactNode } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useMeuPerfil } from '@/features/auth'
import { FaixaPrevia } from '../components/FaixaPrevia'
import { ContextoPrevia, type Previa } from '../previa'
import { AulaPage } from './AulaPage'
import { TemaPage } from './TemaPage'
import { TrilhaPage } from './TrilhaPage'

/** Moldura da pré-visualização: só admin; o dia fica no endereço. */
function ComPrevia({ children }: { children: ReactNode }) {
  const perfil = useMeuPerfil()
  const [busca, setBusca] = useSearchParams()
  const dia = Math.min(365, Math.max(1, Number(busca.get('dia') ?? 1) || 1))
  const previa = useMemo<Previa>(() => ({ dia, sufixo: `?dia=${dia}` }), [dia])
  if (perfil.isPending) return null
  if (perfil.data?.papel !== 'admin') return <Navigate to="/app" replace />
  return (
    <ContextoPrevia.Provider value={previa}>
      <FaixaPrevia dia={dia} aoMudar={(d) => setBusca({ dia: String(d) }, { replace: true })} />
      {children}
    </ContextoPrevia.Provider>
  )
}

/** Painel > Ver como aluna: a trilha exatamente como a aluna vê no dia escolhido. */
export function PreviaPage() {
  return (
    <ComPrevia>
      <TrilhaPage />
    </ComPrevia>
  )
}

export function PreviaTemaPage() {
  return (
    <ComPrevia>
      <TemaPage />
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
