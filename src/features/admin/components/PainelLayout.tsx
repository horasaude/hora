import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { LogoHora } from '@/components/ui'
import { usePapel } from '@/features/auth'
import { textos } from '../textos'
import { Estado } from './Estado'
import { MenuLateral } from './MenuLateral'

function BarraCelular({ aoAbrir }: { aoAbrir: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-ora px-4 lg:hidden">
      <LogoHora clara largura={96} />
      <button
        type="button"
        onClick={aoAbrir}
        aria-label={textos.menu}
        className="grid size-11 place-items-center rounded-xl text-white"
      >
        <span className="flex w-5 flex-col gap-1">
          <span className="h-0.5 rounded bg-current" />
          <span className="h-0.5 rounded bg-current" />
          <span className="h-0.5 rounded bg-current" />
        </span>
      </button>
    </header>
  )
}

function Gaveta({ aoFechar }: { aoFechar: () => void }) {
  return (
    <div className="fixed inset-0 z-30 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label={textos.fecharMenu}
        onClick={aoFechar}
        className="absolute inset-0 bg-tinta/40"
      />
      <aside className="absolute inset-y-0 left-0 w-72 bg-ora">
        <MenuLateral aoNavegar={aoFechar} />
      </aside>
    </div>
  )
}

/** Moldura do painel, só para papel admin: barra lateral fixa no computador, menu no celular. */
export function PainelLayout() {
  const papel = usePapel()
  const [menuAberto, setMenuAberto] = useState(false)
  if (papel.isPending) return <Estado tipo="carregando" />
  if (papel.isError) return <Estado tipo="erro" tentar={() => papel.refetch()} />
  if (papel.data !== 'admin') return <Navigate to="/app" replace />
  return (
    <div className="min-h-dvh bg-areia text-tinta">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-ora lg:block">
        <MenuLateral />
      </aside>
      <BarraCelular aoAbrir={() => setMenuAberto(true)} />
      {menuAberto && <Gaveta aoFechar={() => setMenuAberto(false)} />}
      <main className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1180px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
