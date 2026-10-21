import { Link } from 'react-router-dom'
import { IconeCadeado, IconeCheck, IconePlay } from '@/components/ui'
import type { AulaTrilha } from '@/domain/trilha'
import { urlCapa } from '@/lib/capas'
import { useLinkAula } from '../previa'
import { CapaAutomatica } from './CapaAutomatica'
import { textos } from '../textos'

type DoTema = { capa?: string | null; chave: string | null; cor: string | null }

type Props = {
  aula: AulaTrilha
  numero: number
  proxima: boolean
  fechadaTexto: string
  tema?: DoTema
}

function Marca({ aula }: { aula: AulaTrilha }) {
  const base = 'brilho grid size-9 place-items-center rounded-full'
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
    <span className="grid size-9 place-items-center rounded-full bg-white text-verde-escuro shadow-cartao">
      <IconePlay className="ml-0.5 size-3.5" />
    </span>
  )
}

/** Bolinha à direita: vazia até a aula ser concluída; com check verde quando ela assiste até o fim. */
function Bolinha({ feita }: { feita: boolean }) {
  return feita ? (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-verde-vivo text-white">
      <IconeCheck className="size-3.5" />
      <span className="sr-only">{textos.concluida}</span>
    </span>
  ) : (
    <span aria-hidden className="size-7 shrink-0 rounded-full border-2 border-linha" />
  )
}

/** Miniatura 16:9 com a capa da aula (ou do tema) e o estado no meio. */
function Miniatura({ aula, tema }: { aula: AulaTrilha; tema?: DoTema }) {
  const capa = urlCapa(aula.capa ?? tema?.capa)
  return (
    <span className="relative grid aspect-video w-28 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-verde-escuro sm:w-40">
      {!capa && tema && (
        <CapaAutomatica chave={tema.chave} cor={tema.cor} icone="size-8 opacity-40" />
      )}
      {capa && (
        <img
          src={capa}
          alt=""
          loading="lazy"
          className={`absolute inset-0 size-full object-cover ${aula.liberada ? '' : 'grayscale'}`}
        />
      )}
      <span className="relative">
        <Marca aula={aula} />
      </span>
    </span>
  )
}

/** Aula na lista: miniatura, Aula N e dia, título e duração; fechada mostra quando libera ou Em breve. */
export function CartaoAula({ aula, numero, proxima, fechadaTexto, tema }: Props) {
  const linkAula = useLinkAula()
  const detalhe = [aula.profissional, aula.duracao_minutos && textos.minutos(aula.duracao_minutos)]
    .filter(Boolean)
    .join(' · ')
  const corpo = (
    <>
      <Miniatura aula={aula} tema={tema} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="self-start rounded-full bg-trilho px-2.5 py-0.5 text-[11px] font-bold text-suave">
          {textos.aulaN(numero)}
        </span>
        <span className="line-clamp-2 text-[15px] leading-snug font-bold text-tinta">
          {aula.titulo}
        </span>
        <span className="text-[13px] text-suave">
          {aula.liberada ? detalhe : aula.em_breve ? textos.emBreve : fechadaTexto}
        </span>
      </span>
      {aula.liberada && <Bolinha feita={aula.concluida} />}
    </>
  )
  const classe = `flex items-center gap-3 rounded-[18px] border bg-white p-2.5 pr-4 ${proxima ? 'border-verde-vivo/50 shadow-cartao' : 'border-linha'} ${aula.liberada ? '' : 'opacity-75'}`
  return (
    <li>
      {aula.liberada ? (
        <Link
          to={linkAula(aula.id)}
          className={`${classe} transition hover:shadow-cartao active:scale-[0.99]`}
        >
          {corpo}
        </Link>
      ) : (
        <div className={classe}>{corpo}</div>
      )}
    </li>
  )
}

/** Lista de aulas, uma embaixo da outra, como numa área de membros. */
export function ListaAulas({
  aulas,
  fechada,
  tema,
}: {
  aulas: AulaTrilha[]
  fechada: (a: AulaTrilha) => string
  tema?: DoTema
}) {
  const proxima = aulas.find((a) => a.liberada && !a.concluida)
  return (
    <ul className="flex flex-col gap-3">
      {aulas.map((a, i) => (
        <CartaoAula
          key={a.id}
          aula={a}
          numero={i + 1}
          proxima={a.id === proxima?.id}
          fechadaTexto={fechada(a)}
          tema={tema}
        />
      ))}
    </ul>
  )
}
