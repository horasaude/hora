import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { IconeCheck, PontosGanhos } from '@/components/ui'
import { textos } from '../textos'

/** Bolinha da direita: vazia com borda, ou verde com o check quando o hábito está feito. */
export function Marca({ feito }: { feito: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-[34px] shrink-0 place-items-center rounded-full border-2 transition ${feito ? 'border-verde-vivo bg-verde-vivo text-white' : 'border-linha text-transparent'}`}
    >
      <IconeCheck className="size-4" />
    </span>
  )
}

type Props = {
  icone: ReactNode
  /** Fundo e cor do ícone (classes Tailwind). */
  cor: string
  nome: string
  sub: string
  feito: boolean
  ganho?: { pontos: number; chave: number } | null
  /** Sem aoTocar a linha é só leitura (Água marca sozinha, Refeição vai pelo cardápio). */
  aoTocar?: () => void
  /** Com para, a linha leva a outra tela (Refeição abre os cardápios). */
  para?: string
  desligado?: boolean
  /** Feito, mas ainda dá para tocar de novo (Refeição aceita uma foto por refeição). */
  repetir?: boolean
  /** O que vai à direita no lugar da bolinha. */
  lado?: ReactNode
  children?: ReactNode
}

/** Um hábito do dia: ícone colorido, nome, pontos e a bolinha que vira check verde. */
export function LinhaHabito(p: Props) {
  const corpo = (
    <>
      <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${p.cor}`}>
        {p.icone}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[15px] font-bold text-tinta">{p.nome}</span>
        <span className="block text-[13px] text-suave">{p.sub}</span>
        {p.children}
        {p.feito && <span className="sr-only">{textos.feito(p.nome)}</span>}
      </span>
      {p.lado ?? <Marca feito={p.feito} />}
      {p.ganho && <PontosGanhos pontos={p.ganho.pontos} chave={p.ganho.chave} />}
    </>
  )
  const classe =
    'relative flex w-full items-center gap-3 rounded-[18px] border border-linha bg-white px-4 py-3'
  if (p.para)
    return (
      <li>
        <Link to={p.para} className={`${classe} transition hover:border-verde-vivo`}>
          {corpo}
        </Link>
      </li>
    )
  if (!p.aoTocar || (p.feito && !p.repetir)) return <li className={classe}>{corpo}</li>
  return (
    <li>
      <button
        type="button"
        aria-label={textos.marcar(p.nome)}
        disabled={p.desligado}
        onClick={p.aoTocar}
        className={`${classe} transition hover:border-verde-vivo disabled:opacity-60`}
      >
        {corpo}
      </button>
    </li>
  )
}
