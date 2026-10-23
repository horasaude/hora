import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Voltar } from '@/components/ui'

/** Cartão de resumo; com para, o cartão vira link (ex.: abre a lista filtrada). */
export type Numero = {
  valor: string
  rotulo: string
  tom: 'salvia' | 'ocre' | 'terracota'
  para?: string
}

// Tons suaves da referência do painel, na ordem: sálvia, menta, areia, rosado.
const TONS = ['bg-[#E3EFE8]', 'bg-[#E2F3EC]', 'bg-[#F6EAD2]', 'bg-[#F7E1D9]']

function ValorResumo({ n }: { n: Numero }) {
  return (
    <>
      <span className="block text-[26px] leading-tight font-bold text-verde-escuro">{n.valor}</span>
      <span className="mt-0.5 block text-xs text-[#40504B]">{n.rotulo}</span>
    </>
  )
}

/** Cartões de resumo, lado a lado no topo, cada um num tom suave diferente. */
export function Resumo({ numeros }: { numeros: Numero[] }) {
  return (
    <ul
      className={`grid grid-cols-2 gap-3 ${numeros.length > 4 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}
    >
      {numeros.map((n, i) => (
        <li key={n.rotulo} className={`rounded-2xl ${TONS[i % TONS.length]}`}>
          {n.para ? (
            <Link to={n.para} className="block rounded-2xl p-4 transition hover:brightness-95">
              <ValorResumo n={n} />
            </Link>
          ) : (
            <div className="p-4">
              <ValorResumo n={n} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

type Props = {
  titulo: string
  acao?: ReactNode
  numeros: Numero[]
  /** Item aberto em página inteira: some o título e o resumo, fica só o detalhe com a seta. */
  aberto?: boolean
  children: ReactNode
}

/** Tela do painel: título grande, botão principal, resumo e o conteúdo. */
export function Quadro({ titulo, acao, numeros, aberto, children }: Props) {
  if (aberto) return <section className="flex flex-col gap-5">{children}</section>
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

/** Lista em tela cheia; com um item aberto, ele ocupa a tela inteira com a seta para voltar à lista
 * (o mesmo jeito do Conteúdo, igual no computador e no celular). */
export function Divisao({
  tabela,
  detalhe,
  aberto,
  voltar,
}: {
  tabela: ReactNode
  detalhe: ReactNode
  aberto: boolean
  voltar: { para: string; rotulo: string }
}) {
  if (!aberto) return <div className="min-w-0">{tabela}</div>
  return (
    <>
      <Voltar para={voltar.para} rotulo={voltar.rotulo}>
        {voltar.rotulo}
      </Voltar>
      <div className="min-w-0">{detalhe}</div>
    </>
  )
}
