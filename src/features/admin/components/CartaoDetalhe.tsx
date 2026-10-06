import type { ReactNode } from 'react'

/** Cartão branco à direita com o detalhe e o formulário do item aberto. */
export function CartaoDetalhe({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-linha bg-white p-6">
      <h2 className="text-[1.6rem] leading-snug font-bold tracking-tight text-ora">{titulo}</h2>
      {children}
    </article>
  )
}

/** Pares rótulo e valor, como no cartão da apresentação. */
export function Dados({ itens }: { itens: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
      {itens.map(([rotulo, valor]) => (
        <div key={rotulo} className="contents">
          <dt className="font-medium text-suave">{rotulo}</dt>
          <dd className="text-tinta">{valor}</dd>
        </div>
      ))}
    </dl>
  )
}
