import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useMeuPerfil } from '@/features/auth'
import { FaixaPrevia } from '../components/FaixaPrevia'
import { ContextoPrevia, type Previa } from '../previa'
import { AulaPage } from './AulaPage'
import { TemaPage } from './TemaPage'
import { TrilhaPage } from './TrilhaPage'

// Aulas "concluídas" na prévia: só nesta aba do navegador, para o check e a barra aparecerem sem gravar nada.
const CHAVE = 'ora:previa-concluidas'

function lerConcluidas(): ReadonlySet<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(CHAVE) ?? '[]') as string[])
  } catch {
    return new Set()
  }
}

function guardarConcluidas(s: ReadonlySet<string>) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify([...s]))
  } catch {
    // armazenamento bloqueado: vale só enquanto a tela estiver aberta
  }
}

/** Moldura da pré-visualização: só admin; o dia fica no endereço. */
function ComPrevia({ children }: { children: ReactNode }) {
  const perfil = useMeuPerfil()
  const [busca, setBusca] = useSearchParams()
  const dia = Math.min(365, Math.max(1, Number(busca.get('dia') ?? 1) || 1))
  const [concluidas, setConcluidas] = useState<ReadonlySet<string>>(lerConcluidas)
  const concluir = useCallback((aula: string) => {
    setConcluidas((s) => {
      const nova = new Set([...s, aula])
      guardarConcluidas(nova)
      return nova
    })
  }, [])
  const previa = useMemo<Previa>(
    () => ({ dia, sufixo: `?dia=${dia}`, concluidas, concluir }),
    [dia, concluidas, concluir],
  )
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
