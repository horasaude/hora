import { NavLink, useLocation } from 'react-router-dom'
import { LogoHora } from '@/components/ui'
import { IconeNavegacao } from './IconesNavegacao'
import { textosAluna as t } from './textosAluna'

const ITENS = [
  { para: '/app', nome: t.nav.inicio, icone: 'inicio', fim: true, cor: 'bg-salvia' },
  { para: '/app/trilha', nome: t.nav.trilha, icone: 'trilha', fim: false, cor: 'bg-terracota' },
  { para: '/app/desafios', nome: t.nav.desafios, icone: 'desafios', fim: false, cor: 'bg-ocre' },
  { para: '/app/ranking', nome: t.nav.ranking, icone: 'ranking', fim: false, cor: 'bg-[#8fa7c0]' },
  { para: '/app/perfil', nome: t.nav.perfil, icone: 'perfil', fim: false, cor: 'bg-[#b9a2c4]' },
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
                    className={`grid h-9 w-11 place-items-center rounded-xl ${ativo(isActive, i.para) ? 'brilho brilho-verde' : 'text-suave'}`}
                  >
                    <IconeNavegacao nome={i.icone} />
                  </span>
                  <span className={ativo(isActive, i.para) ? 'text-verde-escuro' : 'text-suave'}>
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

/** Computador: menu lateral branco com a logo, o item aberto em vidro verde e quem está logada embaixo. */
export function BarraLateral({ nome }: { nome: string }) {
  const ativo = useAtivo()
  return (
    <aside className="fixed top-4 bottom-4 left-4 hidden w-60 flex-col rounded-[24px] border border-linha/60 bg-white px-4 py-6 shadow-menu lg:flex">
      <LogoHora largura={120} className="mx-2 mt-1 mb-7" />
      <nav>
        <ul className="flex flex-col gap-1">
          {ITENS.map((i) => (
            <li key={i.para}>
              <NavLink to={i.para} end={i.fim}>
                {({ isActive }) => (
                  <span
                    className={`flex min-h-10 items-center gap-2.5 rounded-[14px] px-3.5 text-[15px] transition ${ativo(isActive, i.para) ? 'brilho brilho-verde font-bold' : 'text-tinta hover:bg-trilho'}`}
                  >
                    {!ativo(isActive, i.para) && (
                      <span className={`size-2 shrink-0 rounded-full ${i.cor}`} aria-hidden />
                    )}
                    {i.nome}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto flex flex-col gap-2 px-3">
        <span className="text-xs text-suave">{t.logadaComo}</span>
        <span className="rounded-xl bg-trilho px-3 py-2 text-sm text-tinta">{nome}</span>
      </div>
    </aside>
  )
}
