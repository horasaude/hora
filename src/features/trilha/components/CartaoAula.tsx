import { Link } from 'react-router-dom'
import { IconeCadeado, IconeCheck, IconePlay } from '@/components/ui'
import type { AulaTrilha } from '@/domain/trilha'
import { useLinkAula } from '../previa'
import { textos } from '../textos'

type Props = { aula: AulaTrilha; proxima: boolean; fechadaTexto: string }

function Marca({ aula }: { aula: AulaTrilha }) {
  const base = 'brilho grid size-10 shrink-0 place-items-center rounded-full'
  if (aula.concluida)
    return (
      <span className={`${base} brilho-verde`}>
        <IconeCheck />
      </span>
    )
  if (!aula.liberada)
    return (
      <span className={`${base} brilho-cinza`}>
        <IconeCadeado />
      </span>
    )
  return (
    <span className={`${base} brilho-escuro`}>
      <IconePlay className="ml-0.5 size-3.5" />
    </span>
  )
}

/** Aula na lista: dia, título, duração e estado (liberada, concluída com check, bloqueada com cadeado). */
export function CartaoAula({ aula, proxima, fechadaTexto }: Props) {
  const linkAula = useLinkAula()
  const detalhe = [aula.profissional, aula.duracao_minutos && textos.minutos(aula.duracao_minutos)]
    .filter(Boolean)
    .join(' · ')
  const corpo = (
    <>
      <span className="w-12 shrink-0 text-center text-[11px] font-bold tracking-wide text-suave uppercase">
        {textos.diaN(aula.dia_liberacao)}
      </span>
      <Marca aula={aula} />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-tinta">{aula.titulo}</span>
        <span className="block text-[13px] text-suave">
          {aula.liberada ? detalhe : fechadaTexto}
        </span>
      </span>
      {aula.concluida && <span className="sr-only">{textos.concluida}</span>}
    </>
  )
  const classe = `flex min-h-[72px] items-center gap-3 rounded-[18px] border bg-white px-3 py-3 ${proxima ? 'border-verde-vivo/50 shadow-cartao' : 'border-linha'} ${aula.liberada ? '' : 'opacity-70'}`
  return (
    <li>
      {aula.liberada ? (
        <Link to={linkAula(aula.id)} className={`${classe} transition hover:shadow-cartao`}>
          {corpo}
        </Link>
      ) : (
        <div className={classe}>{corpo}</div>
      )}
    </li>
  )
}

/** Lista de aulas em grade (2 colunas no computador). */
export function ListaAulas({
  aulas,
  fechada,
}: {
  aulas: AulaTrilha[]
  fechada: (a: AulaTrilha) => string
}) {
  const proxima = aulas.find((a) => a.liberada && !a.concluida)
  return (
    <ul className="grid gap-3 lg:grid-cols-2">
      {aulas.map((a) => (
        <CartaoAula key={a.id} aula={a} proxima={a.id === proxima?.id} fechadaTexto={fechada(a)} />
      ))}
    </ul>
  )
}
