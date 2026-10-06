import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { textos } from '../textos'

const TOM = {
  verde: 'bg-salvia-suave text-ora',
  ocre: 'bg-ocre-suave text-[#80591c]',
  rosa: 'bg-terracota-suave text-terracota-escuro',
  neutro: 'bg-creme text-suave',
}

/** Etiqueta arredondada colorida. */
export function Etiqueta({ tom, children }: { tom: keyof typeof TOM; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TOM[tom]}`}
    >
      {children}
    </span>
  )
}

export function Situacao({ publicado }: { publicado: boolean }) {
  return publicado ? (
    <Etiqueta tom="verde">{textos.publicado}</Etiqueta>
  ) : (
    <Etiqueta tom="ocre">{textos.rascunho}</Etiqueta>
  )
}

/** Tabela branca arredondada com cabeçalho em caixa alta pequena. */
export function Tabela({ colunas, children }: { colunas: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-linha bg-white">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <thead>
          <tr className="border-b border-linha">
            {colunas.map((c) => (
              <th
                key={c}
                scope="col"
                className="px-5 py-3.5 text-[0.7rem] font-semibold tracking-[0.14em] text-suave uppercase"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

type Linha = {
  ativa: boolean
  para: string
  titulo: string
  marca?: ReactNode
  semQuebra?: boolean
  children: ReactNode
}

/** Linha que abre o detalhe à direita; a linha aberta fica destacada. */
export function LinhaTabela({ ativa, para, titulo, marca, semQuebra, children }: Linha) {
  const navegar = useNavigate()
  return (
    <tr
      onClick={() => navegar(para)}
      className={`cursor-pointer border-b border-linha last:border-b-0 ${ativa ? 'bg-salvia-suave/70' : 'hover:bg-areia'}`}
    >
      <td className={`px-5 py-4 ${semQuebra ? 'whitespace-nowrap' : ''}`}>
        <Link
          to={para}
          aria-current={ativa ? 'true' : undefined}
          onClick={(e) => e.stopPropagation()}
          className="block font-semibold text-tinta"
        >
          {titulo}
        </Link>
        {marca && <span className="mt-1 block">{marca}</span>}
      </td>
      {children}
    </tr>
  )
}

export const celula = 'px-5 py-4 text-tinta'

/** Célula que não abre o detalhe ao clicar (botões de ordem). */
export function CelulaAcao({ children }: { children: ReactNode }) {
  return (
    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
      {children}
    </td>
  )
}
