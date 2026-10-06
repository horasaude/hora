import type { ReactNode } from 'react'

export type Numero = { valor: string; rotulo: string; tom: 'salvia' | 'ocre' | 'terracota' }

// Tons suaves da referência do painel, na ordem: sálvia, menta, areia, rosado.
const TONS = ['bg-[#E3EFE8]', 'bg-[#E2F3EC]', 'bg-[#F6EAD2]', 'bg-[#F7E1D9]']

/** Cartões de resumo, lado a lado no topo, cada um num tom suave diferente. */
export function Resumo({ numeros }: { numeros: Numero[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {numeros.map((n, i) => (
        <li key={n.rotulo} className={`rounded-2xl p-4 ${TONS[i % TONS.length]}`}>
          <span className="block text-[26px] leading-tight font-bold text-verde-escuro">
            {n.valor}
          </span>
          <span className="mt-0.5 block text-xs text-[#40504B]">{n.rotulo}</span>
        </li>
      ))}
    </ul>
  )
}

type Props = { titulo: string; acao?: ReactNode; numeros: Numero[]; children: ReactNode }

/** Tela do painel: título grande, botão principal, resumo e o conteúdo. */
export function Quadro({ titulo, acao, numeros, children }: Props) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[26px] leading-tight font-bold text-verde-escuro">{titulo}</h1>
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
