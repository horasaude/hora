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

/** No meio da miniatura: play quando a aula está aberta (feita ou não), cadeado quando fechada. */
function Marca({ aula }: { aula: AulaTrilha }) {
  if (!aula.liberada)
    return (
      <span className="brilho brilho-cinza grid size-[30px] place-items-center rounded-full">
        <IconeCadeado className="size-3.5" />
      </span>
    )
  return (
    <span className="grid size-[30px] place-items-center rounded-full bg-white/95 text-verde-escuro shadow-cartao">
      <IconePlay className="ml-0.5 size-3" />
    </span>
  )
}

/** Bolinha à direita: vazia até a aula ser concluída; com check verde quando ela assiste até o fim. */
function Bolinha({ feita }: { feita: boolean }) {
  return feita ? (
    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-verde-vivo text-white">
      <IconeCheck className="size-3" />
      <span className="sr-only">{textos.concluida}</span>
    </span>
  ) : (
    <span aria-hidden className="size-6 shrink-0 rounded-full border-2 border-linha" />
  )
}

/** Miniatura 16:9 com a capa da aula (ou do tema) presa no topo e o estado no meio. */
function Miniatura({ aula, tema }: { aula: AulaTrilha; tema?: DoTema }) {
  const capa = urlCapa(aula.capa) ?? aula.miniatura ?? urlCapa(tema?.capa)
  return (
    <span className="relative grid aspect-video w-[42%] max-w-[150px] shrink-0 place-items-center overflow-hidden rounded-[12px] bg-tinta">
      {!capa && tema && (
        <CapaAutomatica chave={tema.chave} cor={tema.cor} icone="size-8 opacity-40" />
      )}
      {capa && (
        <img
          src={capa}
          alt=""
          loading="lazy"
          className={`absolute inset-0 size-full object-cover object-top ${aula.liberada ? '' : 'grayscale'}`}
        />
      )}
      <span className="relative">
        <Marca aula={aula} />
      </span>
    </span>
  )
}

/** Aula na lista: miniatura com play, Aula N, título e a bolinha; fechada mostra quando libera ou Em breve. */
export function CartaoAula({ aula, numero, proxima, fechadaTexto, tema }: Props) {
  const linkAula = useLinkAula()
  const corpo = (
    <>
      <Miniatura aula={aula} tema={tema} />
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="self-start rounded-full bg-trilho px-2 py-px text-[11px] font-bold text-suave">
          {textos.aulaN(numero)}
        </span>
        <span className="line-clamp-2 text-[14px] leading-snug font-bold text-tinta">
          {aula.titulo}
        </span>
        {!aula.liberada && (
          <span className="text-[12px] text-suave">
            {aula.em_breve ? textos.emBreve : fechadaTexto}
          </span>
        )}
      </span>
      {aula.liberada && <Bolinha feita={aula.concluida} />}
    </>
  )
  const classe = `flex items-center gap-3 rounded-[18px] border bg-white py-[9px] pr-3.5 pl-[9px] ${proxima ? 'border-verde-vivo/50 shadow-cartao' : 'border-linha'} ${aula.liberada ? '' : 'opacity-75'}`
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
