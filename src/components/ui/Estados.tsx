import type { ReactNode } from 'react'
import { Cartao } from './Cartao'

/** Carregando em esqueleto: blocos claros que pulsam no lugar dos cartões (o texto fica para leitor de tela). */
export function Carregando({ texto, blocos = 3 }: { texto: string; blocos?: number }) {
  return (
    <div role="status" aria-busy="true" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <span className="sr-only">{texto}</span>
      {Array.from({ length: blocos }, (_, i) => (
        <div
          key={i}
          aria-hidden
          className="flex flex-col gap-3 rounded-[22px] bg-white p-5 shadow-cartao"
        >
          <span className="esqueleto h-4 w-1/3 rounded-full" />
          <span className="esqueleto h-5 w-4/5 rounded-full" />
          <span className="esqueleto h-4 w-2/3 rounded-full" />
        </div>
      ))}
    </div>
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
