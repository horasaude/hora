import type { ReactNode } from 'react'
import { useAbrirCompra } from '../hooks/compraContexto'

/** Bloco da página preta: largura confortável e respiro igual em todas as seções. */
export function Bloco({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <section id={id} className="revelar px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  )
}

/** Etiqueta verde em caixa alta e título com a parte final em destaque verde. */
export function Titulo({ etiqueta, titulo, destaque }: Record<string, string>) {
  return (
    <header className="mx-auto max-w-3xl text-center">
      {etiqueta && (
        <p className="text-xs font-semibold tracking-[0.22em] text-verde-vivo uppercase">
          {etiqueta}
        </p>
      )}
      <h2 className="mt-3 font-titulo text-3xl leading-tight text-creme sm:text-5xl">
        {titulo} <em className="text-verde-vivo">{destaque}</em>
      </h2>
    </header>
  )
}

/** Botão verde da Black: abre o popup de compra já no plano mensal. */
export function BotaoBlack({ children }: { children: string }) {
  const abrir = useAbrirCompra()
  return (
    <button
      type="button"
      onClick={() => abrir('recorrente')}
      className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-verde-vivo px-8 text-sm font-bold tracking-[0.12em] text-[#04140d] uppercase shadow-[0_0_40px_rgb(31_168_110/0.45)] transition hover:-translate-y-0.5 hover:bg-[#25c17f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-verde-vivo sm:w-auto"
    >
      {children}
    </button>
  )
}
