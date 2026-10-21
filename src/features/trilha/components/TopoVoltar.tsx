import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { textos } from '../textos'
import { IconeVoltar } from './IconesTrilha'

const bola =
  'grid size-9 shrink-0 place-items-center rounded-full bg-white text-verde-escuro shadow-cartao transition group-hover:bg-trilho'

/** Topo com o botão redondo de voltar e o título ao lado (página do tema). */
export function TopoVoltar({ para, children }: { para: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <Link to={para} aria-label={textos.sequencia.voltarRotulo} className={`group ${bola}`}>
        <IconeVoltar />
      </Link>
      <h1 className="min-w-0 flex-1 text-[22px] leading-tight font-bold text-verde-escuro">
        {children}
      </h1>
    </div>
  )
}

/** Voltar com o botão redondo e o texto ao lado, tudo clicável (página da aula). */
export function LinkVoltar({ para, children }: { para: string; children: ReactNode }) {
  return (
    <Link
      to={para}
      className="group flex items-center gap-2.5 self-start text-[16px] font-bold text-verde-escuro"
    >
      <span className={bola}>
        <IconeVoltar />
      </span>
      {children}
    </Link>
  )
}
