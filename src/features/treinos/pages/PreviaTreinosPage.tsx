import { useMemo, type ReactNode } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useMeuPerfil } from '@/features/auth'
import { temaPreparacao } from '../api/treinos.api'
import { ContextoPreviaTreinos } from '../previa'
import { textos } from '../textos'
import { ExecucaoPage } from './ExecucaoPage'
import { TreinosPage } from './TreinosPage'

/** Moldura da pré-visualização de Treinos: só admin; mesmo tema do endereço da prévia da trilha. */
function ComPrevia({ children }: { children: ReactNode }) {
  const perfil = useMeuPerfil()
  const [busca] = useSearchParams()
  const prep = useQuery({ queryKey: ['tema-preparacao'], queryFn: temaPreparacao })
  const tema = busca.get('tema') ?? prep.data ?? null
  const filtro = useMemo(() => ({ tema }), [tema])
  if (perfil.isPending || prep.isPending) return null
  if (perfil.data?.papel !== 'admin') return <Navigate to="/app" replace />
  return (
    <ContextoPreviaTreinos.Provider value={filtro}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#F6EBD3] px-4 py-3 text-sm text-tinta">
        <span>{textos.previa.aviso}</span>
        <Link to={`/app/previa?${busca}`} className="font-bold text-verde-escuro underline">
          {textos.previa.trilha}
        </Link>
      </div>
      {children}
    </ContextoPreviaTreinos.Provider>
  )
}

export function PreviaTreinosPage() {
  return (
    <ComPrevia>
      <TreinosPage />
    </ComPrevia>
  )
}

export function PreviaExecucaoPage() {
  return (
    <ComPrevia>
      <ExecucaoPage />
    </ComPrevia>
  )
}
