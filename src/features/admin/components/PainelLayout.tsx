import { Link, Navigate, NavLink, Outlet } from 'react-router-dom'
import { usePapel } from '@/features/auth'
import { textos } from '../textos'
import { Estado } from './Estado'

const ABAS = [
  { para: 'conteudo', nome: textos.abas.conteudo },
  { para: 'lives', nome: textos.abas.lives },
  { para: 'avisos', nome: textos.abas.avisos },
] as const

/** Moldura do painel: só para papel admin. No celular, abas fixas embaixo. */
export function PainelLayout() {
  const papel = usePapel()
  if (papel.isPending) return <Estado tipo="carregando" />
  if (papel.isError) return <Estado tipo="erro" tentar={() => papel.refetch()} />
  if (papel.data !== 'admin') return <Navigate to="/app" replace />
  return (
    <div className="min-h-dvh bg-creme pb-24 text-tinta">
      <header className="sticky top-0 z-20 border-b border-linha bg-creme/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <span className="flex items-center gap-3">
            <img src="/logo-ora.png" alt="ORA" width={482} height={189} className="h-6 w-auto" />
            <span className="text-xs font-semibold tracking-[0.18em] text-ora uppercase">
              {textos.painel}
            </span>
          </span>
          <Link
            to="/app"
            className="inline-flex min-h-11 items-center text-xs text-suave underline underline-offset-4"
          >
            {textos.sair}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-6">
        <Outlet />
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-linha bg-white">
        <ul className="mx-auto grid max-w-3xl grid-cols-3">
          {ABAS.map((a) => (
            <li key={a.para}>
              <NavLink
                to={a.para}
                className={({ isActive }) =>
                  `flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${isActive ? 'text-ora' : 'text-suave'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`h-1 w-8 rounded-full ${isActive ? 'bg-ora' : 'bg-transparent'}`}
                    />
                    {a.nome}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
