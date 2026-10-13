import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { classeItemMenu, type TomMenu } from './estiloMenu'

// Item do menu lateral, igual no painel (fundo verde escuro) e na área da aluna (fundo branco):
// mesma altura, espaçamento, fonte e bolinha de cor por item.

export function BolinhaMenu({ cor }: { cor: string }) {
  return (
    <span
      className="size-2 shrink-0 rounded-full shadow-[inset_0_1px_1px_rgb(255_255_255/0.6)]"
      style={{ background: cor }}
      aria-hidden
    />
  )
}

type Props = {
  para: string
  nome: string
  cor: string
  tom?: TomMenu
  /** Força o estado ativo (quando a rota não basta para decidir). */
  ativo?: boolean
  fim?: boolean
  aoNavegar?: () => void
  /** Algo à direita do nome (ex.: ponto da live). */
  extra?: ReactNode
}

/** Botão do menu lateral com a bolinha de cor; o ativo fica destacado. */
export function ItemMenuLateral({
  para,
  nome,
  cor,
  tom = 'escuro',
  ativo,
  fim,
  aoNavegar,
  extra,
}: Props) {
  return (
    <li>
      <NavLink
        to={para}
        end={fim}
        onClick={aoNavegar}
        aria-current={ativo ? 'page' : undefined}
        className={({ isActive }) => classeItemMenu(ativo ?? isActive, tom)}
      >
        <BolinhaMenu cor={cor} />
        <span className="flex-1">{nome}</span>
        {extra}
      </NavLink>
    </li>
  )
}
