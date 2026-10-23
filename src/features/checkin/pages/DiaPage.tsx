import { Link } from 'react-router-dom'
import { Carregando, ErroCarregar } from '@/components/ui'
import { CheckinHoje } from '../components/CheckinHoje'
import { ListaHabitos } from '../components/ListaHabitos'
import { VenciODia } from '../components/VenciODia'
import { useMeusCheckins, usePontosDoDia } from '../hooks/useCheckin'
import { textos } from '../textos'

const t = textos.seuDia

function Topo() {
  const hoje = (usePontosDoDia().data ?? []).reduce((s, a) => s + a.pontos_hoje, 0)
  return (
    <header className="flex items-center gap-3">
      <Link
        to="/app"
        aria-label={t.voltar}
        className="grid size-9 shrink-0 place-items-center rounded-full border border-linha bg-white text-verde-escuro"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor">
          <path d="m14.5 6-6 6 6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <h1 className="flex-1 text-[24px] leading-tight font-bold text-verde-escuro lg:text-[28px]">
        {t.titulo}
      </h1>
      <span className="brilho brilho-dourado inline-flex min-h-7 items-center rounded-full px-3 text-xs font-bold">
        {t.hoje(hoje)}
      </span>
    </header>
  )
}

/** Seu dia (/app/dia): os hábitos de hoje, Venci o dia e, embaixo, a semana e a sequência. */
export function DiaPage() {
  const meus = useMeusCheckins()
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <Topo />
      {meus.isPending ? (
        <Carregando texto={textos.carregando} blocos={2} />
      ) : meus.isError ? (
        <ErroCarregar texto={textos.erro} tentar={t.tentar} aoTentar={() => meus.refetch()} />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <ListaHabitos />
            <VenciODia />
          </div>
          <section aria-label={t.semana}>
            <CheckinHoje semAgua />
          </section>
        </div>
      )}
    </section>
  )
}
