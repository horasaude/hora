import type { ReactNode } from 'react'

/** Cartão branco à direita com o detalhe e o formulário do item aberto. */
export function CartaoDetalhe({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-[#ECEFED] bg-white p-5 shadow-painel">
      <h2 className="text-[19px] leading-snug font-bold text-verde-escuro">{titulo}</h2>
      {children}
    </article>
  )
}

/** Pares rótulo e valor, como no cartão da apresentação. */
export function Dados({ itens }: { itens: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[13px] text-[#40504B]">
      {itens.map(([rotulo, valor]) => (
        <div key={rotulo} className="contents">
          <dt className="font-medium text-suave">{rotulo}</dt>
          <dd className="text-tinta">{valor}</dd>
        </div>
      ))}
    </dl>
  )
}
