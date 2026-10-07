import { Link, NavLink, useLocation } from 'react-router-dom'
import { LogoHora } from '@/components/ui'
import { useTemLiveHoje } from '@/features/lives'
import { IconeNavegacao } from './IconesNavegacao'
import { destino, SECOES, secaoAtiva, telaAtiva, type Secao } from './navegacao'
import { textosAluna as t } from './textosAluna'

/** Ponto dourado que pulsa quando há live hoje. */
export function PontoLive({ className = '' }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label={t.nav.liveHoje}
      className={`ponto-live size-2.5 rounded-full bg-dourado ${className}`}
    />
  )
}

function useNavegacao() {
  const { pathname } = useLocation()
  const live = useTemLiveHoje()
  return { secao: secaoAtiva(pathname), tela: telaAtiva(pathname), live }
}

/** Celular: barra fixa embaixo com as 5 abas; a ativa em verde ORA. */
export function BarraInferior() {
  const { secao, live } = useNavegacao()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-linha bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="mx-auto grid max-w-xl grid-cols-5">
        {SECOES.map((s) => {
          const ativa = s.id === secao?.id
          return (
            <li key={s.id}>
              <Link
                to={destino(s)}
                aria-current={ativa ? 'page' : undefined}
                className="relative flex min-h-16 flex-col items-center justify-center gap-1 text-[0.68rem] font-semibold"
              >
                <span
                  className={`grid h-9 w-11 place-items-center rounded-xl ${ativa ? 'brilho brilho-escuro' : 'text-suave'}`}
                >
                  <IconeNavegacao nome={s.icone} />
                </span>
                {s.id === 'comunidade' && live && (
                  <PontoLive className="absolute top-2 right-[calc(50%-1.4rem)]" />
                )}
                <span className={ativa ? 'text-ora' : 'text-suave'}>{s.nome}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function ItemLateral({
  s,
  ativa,
  live,
  telaAberta,
}: {
  s: Secao
  ativa: boolean
  live: boolean
  telaAberta: string | null
}) {
  return (
    <li>
      <Link
        to={destino(s)}
        aria-current={ativa ? 'true' : undefined}
        className={`flex min-h-10 items-center gap-2.5 rounded-[14px] px-3.5 text-[15px] transition ${ativa ? 'brilho brilho-verde font-bold' : 'text-tinta hover:bg-trilho'}`}
      >
        <IconeNavegacao nome={s.icone} />
        <span className="flex-1">{s.nome}</span>
        {s.id === 'comunidade' && live && <PontoLive />}
      </Link>
      {ativa && s.telas.length > 1 && (
        <ul className="mt-1 mb-2 flex flex-col gap-0.5 pl-6">
          {s.telas.map((tela) => (
            <li key={tela.para}>
              <NavLink
                to={tela.para}
                end={tela.exata}
                className={`flex min-h-9 items-center gap-2.5 rounded-xl px-3 text-[14px] ${tela.para === telaAberta ? 'font-bold text-verde-escuro' : 'text-suave hover:bg-trilho'}`}
              >
                <span className={`size-2 shrink-0 rounded-full ${tela.cor}`} aria-hidden />
                <span className="flex-1">{tela.nome}</span>
                {tela.dourada && live && <PontoLive />}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/** Computador: as mesmas 5 abas no menu lateral; a ativa abre as suas telas embaixo, recuadas. */
export function BarraLateral({ nome }: { nome: string }) {
  const { secao, tela, live } = useNavegacao()
  return (
    <aside className="fixed top-4 bottom-4 left-4 hidden w-60 flex-col rounded-[24px] border border-linha/60 bg-white px-4 py-6 shadow-menu lg:flex">
      <LogoHora largura={120} className="mx-2 mt-1 mb-7" />
      <nav className="min-h-0 flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {SECOES.map((s) => (
            <ItemLateral
              key={s.id}
              s={s}
              ativa={s.id === secao?.id}
              live={live}
              telaAberta={tela?.para ?? null}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-4 flex flex-col gap-2 px-3">
        <span className="text-xs text-suave">{t.logadaComo}</span>
        <span className="rounded-xl bg-trilho px-3 py-2 text-sm text-tinta">{nome}</span>
      </div>
    </aside>
  )
}

/** Telas da aba aberta como pílulas no topo (ativa em verde ORA, as outras em areia com borda fina). */
export function AbasDaSecao() {
  const { secao, tela, live } = useNavegacao()
  if (!secao || secao.telas.length < 2) return null
  return (
    <nav
      aria-label={secao.nome}
      className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1 lg:mb-8"
    >
      {secao.telas.map((x) => {
        const ativa = x === tela
        return (
          <Link
            key={x.para}
            to={x.para}
            aria-current={ativa ? 'page' : undefined}
            className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] font-bold transition ${
              ativa
                ? 'border-ora bg-ora text-white'
                : `bg-areia text-tinta hover:bg-creme ${x.dourada ? 'border-dourado' : 'border-linha'}`
            }`}
          >
            {x.dourada && !live && <span aria-hidden className="size-2 rounded-full bg-dourado" />}
            {x.dourada && live && <PontoLive />}
            {x.nome}
          </Link>
        )
      })}
    </nav>
  )
}
