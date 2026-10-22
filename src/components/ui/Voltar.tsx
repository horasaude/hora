import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconeVoltar } from './Icones'

const bola =
  'grid size-9 shrink-0 place-items-center rounded-full bg-white text-verde-escuro shadow-cartao transition group-hover:bg-trilho'
const classe =
  'group flex min-h-10 items-center gap-2.5 self-start text-[15px] font-bold text-verde-escuro'

type Props = { rotulo: string; children?: ReactNode } & (
  | { para: string; historico?: boolean; aoClicar?: never }
  | { aoClicar: () => void; para?: never; historico?: never }
)

/** Há página anterior do app nesta aba (o React Router conta em history.state.idx). */
const temAnterior = () => Number((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0

/** Seta redonda de voltar, com o texto ao lado quando houver; vai para um endereço ou chama aoClicar.
 * Com historico, volta para a página de onde ela veio e só usa o endereço quando abriu direto. */
export function Voltar({ rotulo, children, para, aoClicar, historico }: Props) {
  const navegar = useNavigate()
  const corpo = (
    <>
      <span className={bola}>
        <IconeVoltar />
      </span>
      {children}
    </>
  )
  const rotuloSo = children ? undefined : rotulo
  if (para)
    return (
      <Link
        to={para}
        aria-label={rotuloSo}
        className={classe}
        onClick={(e) => {
          if (!historico || !temAnterior()) return
          e.preventDefault()
          void navegar(-1)
        }}
      >
        {corpo}
      </Link>
    )
  return (
    <button type="button" onClick={aoClicar} aria-label={rotuloSo} className={classe}>
      {corpo}
    </button>
  )
}
