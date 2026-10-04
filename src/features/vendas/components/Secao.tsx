import type { ReactNode } from 'react'

type Props = {
  id?: string
  titulo: string
  fundo?: 'branco' | 'areia'
  children: ReactNode
}

export function Secao({ id, titulo, fundo = 'branco', children }: Props) {
  return (
    <section id={id} className={`px-4 py-14 ${fundo === 'areia' ? 'bg-areia' : 'bg-white'}`}>
      <div className="mx-auto max-w-2xl">
        <h2 className="font-titulo text-3xl leading-tight text-ora">{titulo}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  )
}

/** Botão em forma de link, para âncoras e, na tarefa 3, os links de pagamento. */
export function LinkBotao({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center justify-center rounded-lg bg-ora px-6 font-semibold text-white transition hover:opacity-90"
    >
      {children}
    </a>
  )
}
