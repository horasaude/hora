import { Link, useLocation } from 'react-router-dom'
import { BotaoBrilho, ItemMenuLateral, LogoOra, Segmento } from '@/components/ui'
import { useSair } from '@/features/auth'
import { useTemLiveHoje } from '@/features/lives'
import { IconeNavegacao } from './IconesNavegacao'
import { destino, MENU_LATERAL, SECOES, secaoAtiva, telaAtiva, type Secao } from './navegacao'
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
                className="relative flex min-h-16 flex-col items-center justify-center gap-1 text-[0.62rem] font-semibold tracking-tight sm:text-[0.68rem]"
              >
                <span
                  className={`grid h-9 w-11 place-items-center rounded-xl ${ativa ? 'brilho brilho-escuro' : 'text-suave'}`}
                >
                  <IconeNavegacao nome={s.icone} />
                </span>
                {s.id === 'comunidade' && live && (
                  <PontoLive className="absolute top-2 right-[calc(50%-1.4rem)]" />
                )}
                <span className={`max-w-full truncate px-0.5 ${ativa ? 'text-ora' : 'text-suave'}`}>
                  {s.nome}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Computador: lista simples de botões, igual ao menu do painel; o ativo em vidro verde. */
export function BarraLateral({ nome }: { nome: string }) {
  const { tela, live } = useNavegacao()
  const sair = useSair()
  return (
    <aside className="fixed top-4 bottom-4 left-4 hidden w-60 flex-col rounded-[24px] border border-linha/60 bg-white px-3.5 py-6 shadow-menu lg:flex">
      <LogoOra largura={118} className="mx-2.5 mb-2" />
      <nav className="mt-6 min-h-0 flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {MENU_LATERAL.map((i) => (
            <ItemMenuLateral
              key={i.para}
              tom="claro"
              para={i.para}
              nome={i.nome}
              cor={i.cor}
              fim={i.fim}
              ativo={tela?.para === i.para}
              extra={i.live && live ? <PontoLive /> : undefined}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-3 flex shrink-0 flex-col gap-2 border-t border-linha px-3 pt-4">
        <span className="text-xs text-suave">{t.logadaComo}</span>
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate rounded-xl bg-trilho px-3 py-2 text-sm text-tinta">
            {nome}
          </span>
          <BotaoBrilho tom="cinza" onClick={() => sair.mutate()} disabled={sair.isPending}>
            {sair.isPending ? t.saindo : t.sair}
          </BotaoBrilho>
        </div>
      </div>
    </aside>
  )
}

/** Telas da aba aberta como pílulas no topo, só no celular (no computador o menu lateral já mostra todas). */
export function AbasDaSecao() {
  const { secao, tela, live } = useNavegacao()
  if (!secao || secao.telas.length < 2) return null
  if (secao.id === 'comunidade')
    return <TopoComunidade secao={secao} ativa={tela?.para} live={live} />
  return (
    <nav
      aria-label={secao.nome}
      className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden"
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

/** Comunidade no celular: o título da seção e o seletor Lives | Fórum | Ranking. */
function TopoComunidade({ secao, ativa, live }: { secao: Secao; ativa?: string; live: boolean }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:hidden">
      <p className="text-[28px] leading-tight font-bold text-verde-escuro">{secao.nome}</p>
      <Segmento
        rotulo={secao.nome}
        ativa={ativa}
        opcoes={secao.telas.map((x) => ({
          para: x.para,
          nome: x.nome,
          extra: x.dourada && live ? <PontoLive /> : undefined,
        }))}
      />
    </div>
  )
}
