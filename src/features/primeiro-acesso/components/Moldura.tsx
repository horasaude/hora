import type { ReactNode } from 'react'
import { textos } from '../textos'

type Props = {
  passo: number
  total: number
  children: ReactNode
  podeSeguir: boolean
  ocupado?: boolean
  aoContinuar: () => void
  erro?: string
}

/** Uma coisa por tela: marcador de passos em cima, conteúdo e o botão grande "Continuar" embaixo. */
export function Moldura({ passo, total, children, podeSeguir, ocupado, aoContinuar, erro }: Props) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (podeSeguir && !ocupado) aoContinuar()
      }}
      className="flex min-h-dvh flex-col px-6 pt-6 pb-8"
    >
      <div className="flex gap-1.5" role="img" aria-label={textos.passo(passo, total)}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i < passo ? 'bg-ora' : 'bg-linha'}`}
          />
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-5 py-10">{children}</div>
      {erro && (
        <p role="alert" className="mb-3 text-center text-sm text-terracota-escuro">
          {erro}
        </p>
      )}
      <button
        type="submit"
        disabled={!podeSeguir || ocupado}
        className="min-h-14 rounded-2xl bg-ora text-base font-semibold text-white disabled:opacity-40"
      >
        {ocupado ? textos.salvando : textos.continuar}
      </button>
    </form>
  )
}
