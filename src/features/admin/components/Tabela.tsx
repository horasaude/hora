import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EtiquetaBrilho } from '@/components/ui'
import { textos } from '../textos'

const TOM = { verde: 'verde', ocre: 'dourado', rosa: 'coral', neutro: 'cinza' } as const

/** Etiqueta em vidro: verde feito, dourado destaque, coral alerta, cinza ainda não feito ou neutro. */
export function Etiqueta({ tom, children }: { tom: keyof typeof TOM; children: ReactNode }) {
  return <EtiquetaBrilho tom={TOM[tom]}>{children}</EtiquetaBrilho>
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
    <div className="overflow-x-auto rounded-[18px] border border-[#ECEFED] bg-white shadow-painel">
      <table className="w-full min-w-[34rem] text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#F0F2F1]">
            {colunas.map((c) => (
              <th
                key={c}
                scope="col"
                className="px-3.5 py-3 text-[10px] font-bold tracking-[0.08em] text-[#8A9692] uppercase"
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
      className={`cursor-pointer border-b border-[#F4F5F4] last:border-b-0 ${ativa ? 'bg-[#F3F8F5]' : 'hover:bg-[#F8FAF9]'}`}
    >
      <td className={`px-3.5 py-3 ${semQuebra ? 'whitespace-nowrap' : ''}`}>
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

export const celula = 'px-3.5 py-3 text-tinta'

/** Célula que não abre o detalhe ao clicar (botões de ordem). */
export function CelulaAcao({ children }: { children: ReactNode }) {
  return (
    <td className="px-3.5 py-3" onClick={(e) => e.stopPropagation()}>
      {children}
    </td>
  )
}
