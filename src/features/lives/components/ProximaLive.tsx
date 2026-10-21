import { contagem, janelaDaLive, nomesDasProfissionais, PROFISSIONAIS } from '@/domain/lives'
import { diaSemanaEHora, formatarDataHora } from '@/lib/datas'
import { baixarIcs, gerarIcs } from '@/lib/ics'
import { usePontosDaRegra } from '@/features/ranking'
import type { Live } from '../api/lives.api'
import { useLembrete } from '../hooks/useLives'
import { textos } from '../textos'
import { BotaoEntrar } from './BotaoEntrar'
import { IconeAgenda, IconeRadio, IconeSino } from './IconesLive'

function adicionarNaAgenda(l: Live) {
  const inicio = new Date(l.data)
  const nome = nomesDasProfissionais(l.profissionais)
  baixarIcs(
    `live-hora-${inicio.toISOString().slice(0, 10)}`,
    gerarIcs({
      uid: l.id,
      titulo: `Live ORA: ${l.tema}`,
      inicio,
      fim: new Date(inicio.getTime() + l.duracao_minutos * 60_000),
      descricao: nome ? textos.com(nome) : undefined,
      url: `${window.location.origin}/app/lives`,
    }),
  )
}

const botaoClaro = (ligado = false) =>
  `grid size-10 shrink-0 place-items-center rounded-full border-[1.5px] transition disabled:opacity-50 ${
    ligado
      ? 'border-dourado bg-dourado text-verde-escuro'
      : 'border-white/35 bg-white/15 text-white hover:bg-white/25'
  }`

/** Agenda (.ics) e lembrete com sino, em botões claros sobre o verde. */
function Acoes({ live }: { live: Live }) {
  const lembrete = useLembrete()
  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label={textos.agenda}
        title={textos.agenda}
        onClick={() => adicionarNaAgenda(live)}
        className={botaoClaro()}
      >
        <IconeAgenda />
      </button>
      <button
        type="button"
        aria-label={live.lembrete ? textos.lembrando : textos.lembrar}
        title={live.lembrete ? textos.lembrando : textos.lembrar}
        aria-pressed={live.lembrete}
        disabled={lembrete.isPending}
        onClick={() => lembrete.mutate({ live: live.id, ligar: !live.lembrete })}
        className={botaoClaro(live.lembrete)}
      >
        <IconeSino />
      </button>
    </div>
  )
}

const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Próxima live: foto da profissional com o dia e a hora em coral, e embaixo o verde ORA com tema, Entrar e lembrete. */
export function ProximaLive({ live, agora }: { live: Live; agora: Date }) {
  const pontos = usePontosDaRegra('live')
  const inicio = new Date(live.data)
  const aoVivo = janelaDaLive(inicio, live.duracao_minutos, agora) === 'aberta' && agora >= inicio
  const c = contagem(inicio, agora)
  const primeira = live.profissionais[0]
  const foto = primeira ? PROFISSIONAIS[primeira].foto : live.capa
  const nome = nomesDasProfissionais(live.profissionais)
  return (
    <article className="overflow-hidden rounded-[22px] bg-verde-escuro text-white shadow-cartao lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="relative h-[150px] bg-trilho sm:h-52 lg:h-full lg:min-h-64">
        {foto && <img src={foto} alt="" className="size-full object-cover object-[center_20%]" />}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-coral px-2.5 py-1 text-[11px] font-bold text-white">
          <IconeRadio />
          {aoVivo ? textos.aoVivo : capitalizar(diaSemanaEHora(inicio))}
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4 lg:justify-center lg:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-[21px] leading-tight font-bold lg:text-[24px]">{live.tema}</h2>
          <p className="text-[13px] text-white/85">
            {[nome && textos.comMaiusculo(nome), textos.meet].filter(Boolean).join(' · ')}
          </p>
          <p className="text-[13px] text-white/85" aria-live="polite">
            {formatarDataHora(inicio)} · {textos.duracao(live.duracao_minutos)}
            {!aoVivo && ` · ${textos.falta(c.dias, c.horas, c.minutos)}`}
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-2">
          <BotaoEntrar live={live} agora={agora} claro rotulo={textos.entrarCurto(pontos)} />
          <Acoes live={live} />
        </div>
        {live.lembrete && <p className="text-[12px] text-white/85">{textos.lembreteAviso}</p>}
      </div>
    </article>
  )
}
