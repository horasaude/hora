import type { ReactNode } from 'react'
import { Cartao } from './Cartao'

/** Carregando, erro com Tentar de novo e vazio, iguais em todas as telas da aluna. */
export function Carregando({ texto }: { texto: string }) {
  return (
    <p role="status" className="py-6 text-center text-sm text-suave">
      {texto}
    </p>
  )
}

export function ErroCarregar({
  texto,
  tentar,
  aoTentar,
}: {
  texto: string
  tentar: string
  aoTentar: () => void
}) {
  return (
    <Cartao role="alert" className="flex flex-col items-start gap-3 text-sm text-tinta">
      <p>{texto}</p>
      <button type="button" onClick={aoTentar} className="min-h-9 font-bold text-ora underline">
        {tentar}
      </button>
    </Cartao>
  )
}

export function Vazio({ children }: { children: ReactNode }) {
  return <Cartao className="py-8 text-center text-sm text-suave">{children}</Cartao>
}
