import { Retrato } from '@/components/ui'
import { podio, type LinhaRanking } from '@/domain/engajamento'
import type { Periodo } from '../api/ranking.api'
import { useRetratos } from '../hooks/useRanking'
import { textos } from '../textos'

const t = textos.podio
const DEGRAU = {
  1: 'h-14 brilho brilho-dourado',
  2: 'h-10 brilho brilho-prata',
  3: 'h-7 brilho brilho-coral',
} as const
const ORDEM = { 1: 'order-2', 2: 'order-1', 3: 'order-3' } as const

function Trofeu() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5 text-dourado">
      <path
        d="M7 3h10v5a5 5 0 0 1-10 0V3ZM7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4M12 13v4M8.5 21h7M9.5 17h5v4h-5z"
        fill="currentColor"
        fillOpacity=".25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Lugar({ lugar, l, foto }: { lugar: 1 | 2 | 3; l?: LinhaRanking; foto: string | null }) {
  return (
    <li className={`flex min-w-0 flex-1 flex-col items-center gap-1 ${ORDEM[lugar]}`}>
      {l ? (
        <Retrato
          nome={l.apelido}
          foto={foto}
          lugar={lugar}
          tamanho={lugar === 1 ? 'size-12' : 'size-10'}
          texto="text-base"
        />
      ) : (
        <span
          aria-hidden
          className={`grid place-items-center rounded-full border-2 border-dashed border-[#D8DCD9] text-sm font-bold text-[#C2C8C4] ${lugar === 1 ? 'size-12' : 'size-10'}`}
        >
          ?
        </span>
      )}
      <span
        className={`max-w-full truncate text-xs font-bold ${l?.eu ? 'text-ora' : 'text-tinta'}`}
      >
        {l ? `${l.apelido}${l.eu ? ` ${textos.voce}` : ''}` : t.vago}
      </span>
      <span className="text-[11px] text-suave">{l ? t.pontos(l.pontos) : '-'}</span>
      <span
        className={`grid w-full place-items-center rounded-t-xl text-sm font-bold ${DEGRAU[lugar]} ${l ? '' : 'opacity-50'}`}
      >
        {t.lugar(lugar)}
      </span>
    </li>
  )
}

/** Pódio do período: 2º, 1º (com troféu) e 3º, com a foto de perfil e a coroinha de cada uma. */
export function Podio({ linhas, periodo }: { linhas: LinhaRanking[]; periodo: Periodo }) {
  const tres = podio(linhas)
  const fotos = useRetratos(tres.map((l) => l.avatar_path)).data
  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-[22px] bg-gradient-to-b from-[#FFF6E5] to-white px-4 pt-4 shadow-cartao">
      <h2 className="flex items-center justify-center gap-1.5 text-sm font-bold text-verde-escuro">
        <Trofeu />
        {t.titulo(periodo)}
      </h2>
      <ol className="flex items-end gap-2 pt-4 sm:gap-4">
        {([1, 2, 3] as const).map((lugar) => {
          const l = tres.find((x) => x.posicao === lugar)
          const foto = (l?.avatar_path && fotos?.get(l.avatar_path)) || null
          return <Lugar key={lugar} lugar={lugar} l={l} foto={foto} />
        })}
      </ol>
    </section>
  )
}
