import { NavLink, useLocation } from 'react-router-dom'
import { IconeNavegacao } from './IconesNavegacao'
import { textosAluna as t } from './textosAluna'

const ITENS = [
  { para: '/app', nome: t.nav.inicio, icone: 'inicio', fim: true },
  { para: '/app/trilha', nome: t.nav.trilha, icone: 'trilha', fim: false },
  { para: '/app/desafios', nome: t.nav.desafios, icone: 'desafios', fim: false },
  { para: '/app/ranking', nome: t.nav.ranking, icone: 'ranking', fim: false },
  { para: '/app/perfil', nome: t.nav.perfil, icone: 'perfil', fim: false },
] as const

/** Item ativo: a rota dele, e a Trilha também quando a aluna está numa aula. */
function useAtivo() {
  const emAula = useLocation().pathname.startsWith('/app/aula')
  return (isActive: boolean, para: string) => isActive || (emAula && para === '/app/trilha')
}

/** Celular: barra fixa embaixo com os 5 ícones. */
export function BarraInferior() {
  const ativo = useAtivo()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-linha bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-5">
        {ITENS.map((i) => (
          <li key={i.para}>
            <NavLink
              to={i.para}
              end={i.fim}
              className="flex min-h-16 flex-col items-center justify-center gap-1 text-[0.68rem] font-semibold"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid h-9 w-11 place-items-center rounded-xl ${ativo(isActive, i.para) ? 'bg-ora text-white' : 'text-suave'}`}
                  >
                    <IconeNavegacao nome={i.icone} />
                  </span>
                  <span className={ativo(isActive, i.para) ? 'text-ora' : 'text-suave'}>
                    {i.nome}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Computador: barra lateral verde no mesmo padrão do painel, com quem está logada embaixo. */
export function BarraLateral({ nome }: { nome: string }) {
  const ativo = useAtivo()
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-ora px-4 py-8 lg:flex">
      <nav>
        <ul className="flex flex-col gap-1">
          {ITENS.map((i) => (
            <li key={i.para}>
              <NavLink to={i.para} end={i.fim}>
                {({ isActive }) => (
                  <span
                    className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-[0.95rem] text-white transition ${ativo(isActive, i.para) ? 'bg-white/12 font-semibold' : 'hover:bg-white/6'}`}
                  >
                    <IconeNavegacao nome={i.icone} />
                    {i.nome}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto flex flex-col gap-2 px-3">
        <span className="text-xs text-white/60">{t.logadaComo}</span>
        <span className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white">{nome}</span>
      </div>
    </aside>
  )
}
