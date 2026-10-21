import { Link } from 'react-router-dom'
import { useSequencia } from '@/features/checkin'
import { useMinhaPosicao } from '@/features/ranking'
import { textos } from '../textos'
import { IconeEstrela } from './Icones'

const t = textos.pontos

/** Cartão verde dos pontos do mês, dias seguidos e posição no ranking; leva ao ranking. */
export function CartaoPontos() {
  const { eu, isPending, isError } = useMinhaPosicao('mes')
  const { seguidos } = useSequencia()
  const pontos = eu?.pontos ?? 0
  return (
    <Link
      to="/app/ranking"
      aria-busy={isPending}
      className="flex items-center gap-3.5 rounded-[22px] bg-gradient-to-br from-verde-escuro to-[#2d6a5b] p-4 text-white shadow-cartao transition hover:brightness-110 lg:p-5"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15 text-dourado">
        <IconeEstrela className="size-6" />
      </span>
      <span className="flex flex-col">
        <strong className="text-[28px] leading-none font-bold">
          {isError ? '-' : pontos.toLocaleString('pt-BR')}
        </strong>
        <span className="mt-1 text-xs opacity-90">
          {t.rotulo}
          {seguidos > 0 && ` · ${t.seguidos(seguidos)}`}
        </span>
      </span>
      <span className="ml-auto text-right text-xs leading-snug opacity-90">
        {eu && pontos > 0 ? (
          <>
            <strong className="block text-sm">{t.lugar(eu.posicao)}</strong>
            {t.noRanking}
          </>
        ) : (
          t.ver
        )}
      </span>
    </Link>
  )
}
