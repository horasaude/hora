import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { textos } from '../textos'

/** Topo das páginas inteiras (receita e cardápio): voltar, título e as ações. */
export function BarraTopo({
  voltar,
  titulo,
  aviso,
  children,
}: {
  voltar: string
  titulo: string
  aviso?: string
  children: ReactNode
}) {
  return (
    <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <Link
          to={voltar}
          className="inline-flex min-h-9 items-center text-[13px] text-suave underline underline-offset-4"
        >
          {textos.voltar}
        </Link>
        <h1 className="truncate text-[26px] leading-tight font-bold text-verde-escuro">{titulo}</h1>
        {aviso && <p className="text-xs font-bold text-[#B87508]">{aviso}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </header>
  )
}

/** Cartão branco das páginas inteiras. */
export function Bloco({
  titulo,
  children,
  className = '',
}: {
  titulo?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`flex flex-col gap-4 rounded-[18px] border border-[#ECEFED] bg-white p-5 shadow-painel ${className}`}
    >
      {titulo && <h2 className="text-base font-bold text-verde-escuro">{titulo}</h2>}
      {children}
    </section>
  )
}
