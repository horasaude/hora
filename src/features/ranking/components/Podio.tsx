import { Coroa } from '@/components/ui'
import { podio, type LinhaRanking } from '@/domain/engajamento'
import type { Periodo } from '../api/ranking.api'
import { useRetratos } from '../hooks/useRanking'
import { textos } from '../textos'
import { Inicial } from './Inicial'

const t = textos.podio
/** Base de cada degrau: 2º prata, 1º dourado e mais alto, 3º terracota. */
const BASE = {
  1: 'h-24 bg-dourado',
  2: 'h-[70px] bg-[#b9bcc4]',
  3: 'h-14 bg-terracota',
} as const

function Lugar({ lugar, l, foto }: { lugar: 1 | 2 | 3; l?: LinhaRanking; foto: string | null }) {
  const primeiro = lugar === 1
  return (
    <li className="flex min-w-0 flex-col items-center gap-1.5 text-center">
      {primeiro && <Coroa lugar={1} className="w-7" />}
      {l ? (
        <Inicial
          nome={l.apelido}
          foto={foto}
          posicao={lugar}
          tamanho={primeiro ? 'size-16 text-[22px]' : 'size-[54px] text-lg'}
        />
      ) : (
        <span
          aria-hidden
          className={`grid place-items-center rounded-full border-2 border-dashed border-[#D8DCD9] font-bold text-[#C2C8C4] ${primeiro ? 'size-16' : 'size-[54px]'}`}
        >
          ?
        </span>
      )}
      <span
        className={`max-w-full truncate text-[13px] font-bold ${l?.eu ? 'text-verde-vivo' : 'text-tinta'}`}
      >
        {l ? (l.eu ? textos.voceLinha : l.apelido) : t.vago}
      </span>
      <span className="text-[11px] text-suave">{l ? t.pontos(l.pontos) : '-'}</span>
      <span
        aria-label={t.lugar(lugar)}
        className={`grid w-full place-items-center rounded-t-[14px] text-xl font-extrabold text-white ${BASE[lugar]} ${l ? '' : 'opacity-50'}`}
      >
        {lugar}
      </span>
    </li>
  )
}

/** Pódio do período: 2º, 1º (mais alto, com a coroa) e 3º, com a foto ou a inicial. */
export function Podio({ linhas, periodo }: { linhas: LinhaRanking[]; periodo: Periodo }) {
  const tres = podio(linhas)
  const fotos = useRetratos(tres.map((l) => l.avatar_path)).data
  return (
    <section aria-label={t.titulo(periodo)}>
      <ol className="grid grid-cols-[1fr_1.15fr_1fr] items-end gap-2 sm:mx-auto sm:max-w-md">
        {([2, 1, 3] as const).map((lugar) => {
          const l = tres.find((x) => x.posicao === lugar)
          const foto = (l?.avatar_path && fotos?.get(l.avatar_path)) || null
          return <Lugar key={lugar} lugar={lugar} l={l} foto={foto} />
        })}
      </ol>
    </section>
  )
}
