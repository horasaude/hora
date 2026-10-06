import { Link } from 'react-router-dom'
import { Cartao, IconePlay } from '@/components/ui'
import { diaSemanaEHora } from '@/lib/datas'
import type { ProximaLive } from '../api/inicio.api'
import { exemplo, textos } from '../textos'

type Aula = { id: string; titulo: string; duracao_minutos: number | null }

/** Aula de hoje: play verde escuro, título e duração. */
export function AulaDeHoje({ aula }: { aula: Aula }) {
  return (
    <Link to={`/app/aula/${aula.id}`} aria-label={textos.aula.abrir(aula.titulo)}>
      <Cartao className="flex items-center gap-4 bg-white">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-ora text-white">
          <IconePlay className="ml-0.5 size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[0.95rem] font-semibold text-tinta">
            {textos.aula.titulo}
          </span>
          <span className="block text-sm text-suave">
            {aula.titulo}
            {aula.duracao_minutos ? ` · ${aula.duracao_minutos} min` : ''}
          </span>
        </span>
      </Cartao>
    </Link>
  )
}

/** Faixa ocre clara com a próxima live. */
export function FaixaLive({ live }: { live: ProximaLive }) {
  return (
    <p className="rounded-full bg-ocre-suave px-5 py-3 text-center text-sm font-semibold text-[#80591c]">
      {textos.live(diaSemanaEHora(new Date(live.data)), live.tema)}
    </p>
  )
}

/** Posição no ranking e pontos da última ação (valores de exemplo por enquanto). */
export function CartaoRanking() {
  const t = textos.ranking
  return (
    <Cartao className="border-transparent bg-salvia-suave">
      <p className="text-sm text-tinta">{t.voce}</p>
      <p className="font-titulo text-[1.8rem] leading-tight font-semibold text-ora lining-nums">
        {t.lugar(exemplo.posicao)}
      </p>
      <p className="text-sm font-semibold text-terracota-escuro">
        {t.pontos(exemplo.pontosUltimaAcao)}
      </p>
    </Cartao>
  )
}
