import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useMeuPerfil } from '@/features/auth'
import { PrimeiroAcesso } from '@/features/primeiro-acesso'
import { IconeNavegacao } from './IconesNavegacao'
import { textosAluna as t } from './textosAluna'

const ITENS = [
  { para: '/app', nome: t.nav.inicio, icone: 'inicio', fim: true },
  { para: '/app/trilha', nome: t.nav.trilha, icone: 'trilha', fim: false },
  { para: '/app/desafios', nome: t.nav.desafios, icone: 'desafios', fim: false },
  { para: '/app/ranking', nome: t.nav.ranking, icone: 'ranking', fim: false },
  { para: '/app/perfil', nome: t.nav.perfil, icone: 'perfil', fim: false },
] as const

function Navegacao() {
  const emAula = useLocation().pathname.startsWith('/app/aula')
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[430px] border-t border-linha bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {ITENS.map((i) => (
          <li key={i.para}>
            <NavLink
              to={i.para}
              end={i.fim}
              className="flex min-h-16 flex-col items-center justify-center gap-1 text-[0.68rem] font-semibold"
            >
              {({ isActive }) => {
                const ativo = isActive || (emAula && i.para === '/app/trilha')
                return (
                  <>
                    <span
                      className={`grid h-9 w-11 place-items-center rounded-xl ${ativo ? 'bg-ora text-white' : 'text-suave'}`}
                    >
                      <IconeNavegacao nome={i.icone} />
                    </span>
                    <span className={ativo ? 'text-ora' : 'text-suave'}>{i.nome}</span>
                  </>
                )
              }}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Área da aluna: largura de celular (centralizada no computador), barra fixa embaixo e primeiro acesso. */
export function LayoutAluna() {
  const perfil = useMeuPerfil()
  const p = perfil.data
  const falta = p && p.papel !== 'admin' && (!p.apelido || !p.consentimento_saude_em)
  return (
    <div className="min-h-dvh bg-areia">
      <div className="mx-auto min-h-dvh max-w-[430px] bg-white text-tinta">
        {perfil.isPending ? (
          <p role="status" className="p-6 text-center text-sm text-suave">
            {t.carregando}
          </p>
        ) : perfil.isError ? (
          <div role="alert" className="p-6 text-center text-sm">
            <p>{t.erro}</p>
            <button
              type="button"
              onClick={() => perfil.refetch()}
              className="mt-2 min-h-11 font-semibold text-ora underline"
            >
              {t.tentar}
            </button>
          </div>
        ) : falta ? (
          <PrimeiroAcesso apelidoAtual={p.apelido} />
        ) : (
          <>
            <main className="px-5 pt-7 pb-28">
              <Outlet />
            </main>
            <Navegacao />
          </>
        )}
      </div>
    </div>
  )
}
