import { Retrato } from '@/components/ui'
import { podio, type LinhaRanking } from '@/domain/engajamento'
import type { Periodo } from '../api/ranking.api'
import { useRetratos } from '../hooks/useRanking'
import { textos } from '../textos'

const t = textos.podio
const DEGRAU = {
  1: 'h-28 brilho brilho-dourado',
  2: 'h-20 brilho brilho-prata',
  3: 'h-14 brilho brilho-coral',
} as const

function Trofeu() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-7 text-dourado drop-shadow">
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

function Lugar({ l, foto }: { l: LinhaRanking; foto: string | null }) {
  const lugar = l.posicao as 1 | 2 | 3
  const grande = lugar === 1
  return (
    <li
      className={`flex min-w-0 flex-1 flex-col items-center gap-2 ${grande ? 'order-2' : lugar === 2 ? 'order-1' : 'order-3'}`}
    >
      <Retrato
        nome={l.apelido}
        foto={foto}
        lugar={lugar}
        tamanho={grande ? 'size-20 lg:size-24' : 'size-16 lg:size-20'}
        texto={grande ? 'text-3xl' : 'text-2xl'}
      />
      <span className={`max-w-full truncate text-sm font-bold ${l.eu ? 'text-ora' : 'text-tinta'}`}>
        {l.apelido}
        {l.eu && ` ${textos.voce}`}
      </span>
      <span className="text-xs text-suave">{t.pontos(l.pontos)}</span>
      <span
        className={`grid w-full place-items-start justify-center rounded-t-2xl pt-2 text-lg font-bold ${DEGRAU[lugar]}`}
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
  if (tres.length === 0) return null
  return (
    <section className="flex flex-col gap-4 rounded-[24px] bg-gradient-to-b from-[#FFF6E5] to-white px-4 pt-5 shadow-cartao">
      <h2 className="flex items-center justify-center gap-2 text-base font-bold text-verde-escuro">
        <Trofeu />
        {t.titulo(periodo)}
      </h2>
      <ol className="flex items-end gap-3 pt-6 sm:gap-6 sm:px-8">
        {tres.map((l) => (
          <Lugar
            key={l.posicao}
            l={l}
            foto={(l.avatar_path && fotos?.get(l.avatar_path)) || null}
          />
        ))}
      </ol>
    </section>
  )
}
