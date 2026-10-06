import { Link } from 'react-router-dom'
import { IconeCheck, IconePlay } from '@/components/ui'
import type { AulaTrilha } from '@/domain/trilha'
import { textos } from '../textos'

type Estado = 'concluida' | 'proxima' | 'liberada' | 'fechada'
type Props = { aula: AulaTrilha; estado: Estado; abre?: string }

const CARTAO: Record<Estado, string> = {
  concluida: '',
  proxima: 'ring-2 ring-verde-vivo/45',
  liberada: '',
  fechada: 'opacity-55',
}

function Marca({ estado }: { estado: Estado }) {
  if (estado === 'concluida')
    return (
      <span className="brilho brilho-verde grid size-9 shrink-0 place-items-center rounded-full">
        <IconeCheck />
      </span>
    )
  if (estado === 'fechada')
    return (
      <span className="brilho brilho-cinza grid size-9 shrink-0 place-items-center rounded-full">
        <span className="size-1 rounded-full bg-suave" />
      </span>
    )
  const cor = estado === 'proxima' ? 'brilho-escuro' : 'brilho-cinza text-verde-escuro'
  return (
    <span className={`brilho ${cor} grid size-9 shrink-0 place-items-center rounded-full`}>
      <IconePlay className="ml-0.5 size-3.5" />
    </span>
  )
}

/** Aula na trilha: concluída (sálvia), próxima (terracota), liberada ou fechada com a data em que abre. */
export function CartaoAula({ aula, estado, abre }: Props) {
  const detalhe = [aula.profissional, aula.duracao_minutos && textos.minutos(aula.duracao_minutos)]
    .filter(Boolean)
    .join(' · ')
  const corpo = (
    <>
      <Marca estado={estado} />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-tinta">{aula.titulo}</span>
        <span className="block text-xs text-suave">
          {estado === 'fechada' && abre ? textos.abreEm(abre) : detalhe}
        </span>
      </span>
    </>
  )
  const classe = `flex min-h-16 items-center gap-3 rounded-[18px] bg-white px-4 py-3 shadow-cartao ${CARTAO[estado]}`
  return (
    <li>
      {estado === 'fechada' ? (
        <div className={classe}>{corpo}</div>
      ) : (
        <Link to={`/app/aula/${aula.id}`} className={classe}>
          {corpo}
          {estado === 'concluida' && <span className="sr-only">{textos.concluida}</span>}
        </Link>
      )}
    </li>
  )
}
