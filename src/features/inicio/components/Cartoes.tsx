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
      <Cartao className="flex items-center gap-4">
        <span className="brilho brilho-escuro grid size-10 shrink-0 place-items-center rounded-full">
          <IconePlay className="ml-0.5 size-3.5" />
        </span>
        <span className="min-w-0">
          <span className="block text-base font-bold text-tinta">{textos.aula.titulo}</span>
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
    <p className="brilho brilho-dourado self-start rounded-full px-3.5 py-2 text-[13px] font-bold">
      {textos.live(diaSemanaEHora(new Date(live.data)), live.tema)}
    </p>
  )
}

/** Posição no ranking e pontos da última ação (valores de exemplo por enquanto). */
export function CartaoRanking() {
  const t = textos.ranking
  return (
    <Cartao>
      <p className="text-sm text-suave">{t.voce}</p>
      <p className="text-[40px] leading-tight font-bold text-verde-escuro">
        {t.lugar(exemplo.posicao)}
      </p>
      <p className="text-sm font-semibold text-terracota-escuro">
        {t.pontos(exemplo.pontosUltimaAcao)}
      </p>
    </Cartao>
  )
}
