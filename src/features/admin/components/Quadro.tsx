import type { ReactNode } from 'react'

export type Numero = { valor: string; rotulo: string; tom: 'salvia' | 'ocre' | 'terracota' }

const FUNDO = { salvia: 'bg-salvia-suave', ocre: 'bg-ocre-suave', terracota: 'bg-terracota-suave' }

/** Cartões coloridos de resumo, lado a lado no topo da tela. */
export function Resumo({ numeros }: { numeros: Numero[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {numeros.map((n) => (
        <li key={n.rotulo} className={`rounded-2xl px-5 py-4 ${FUNDO[n.tom]}`}>
          <span className="block font-titulo text-4xl font-bold text-ora lining-nums">
            {n.valor}
          </span>
          <span className="mt-1 block text-sm font-semibold text-tinta">{n.rotulo}</span>
        </li>
      ))}
    </ul>
  )
}

type Props = { titulo: string; acao?: ReactNode; numeros: Numero[]; children: ReactNode }

/** Tela do painel: título grande, botão principal, resumo e o conteúdo. */
export function Quadro({ titulo, acao, numeros, children }: Props) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-titulo text-3xl font-semibold text-ora lg:text-[2.1rem]">{titulo}</h1>
        {acao}
      </div>
      <Resumo numeros={numeros} />
      {children}
    </section>
  )
}

/** Tabela à esquerda e cartão de detalhe à direita (um embaixo do outro no celular). */
export function Divisao({
  tabela,
  detalhe,
  estreito = false,
}: {
  tabela: ReactNode
  detalhe: ReactNode
  estreito?: boolean
}) {
  const colunas = estreito
    ? 'xl:grid-cols-[minmax(0,1fr)_minmax(0,21rem)]'
    : 'xl:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]'
  return (
    <div className={`grid items-start gap-5 ${colunas}`}>
      <div className="min-w-0">{tabela}</div>
      <div className="min-w-0 xl:sticky xl:top-6">{detalhe}</div>
    </div>
  )
}

export const botaoPrincipal =
  'inline-flex min-h-11 items-center justify-center rounded-xl bg-ora px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50'
