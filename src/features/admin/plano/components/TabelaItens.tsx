import { useState } from 'react'
import { totalItens, type Item } from '@/domain/nutricao'
import { tEditor as t } from '../textosRefeicao'
import { celula, LinhaItem, Numeros } from './LinhaItem'

type Props = {
  itens: Item[]
  aoEditar: (i: number) => void
  aoExcluir: (i: number) => void
  aoMover: (de: number, para: number) => void
}

const gramasTotais = (itens: Item[]) => itens.reduce((s, it) => s + (it.opcoes[0]?.gramas ?? 0), 0)

/** Tabela dos alimentos selecionados: macros por linha, editar, excluir, reordenar e o total. */
export function TabelaItens({ itens, aoEditar, aoExcluir, aoMover }: Props) {
  const [arrastando, setArrastando] = useState<number | null>(null)
  return (
    <div className="overflow-x-auto rounded-xl border border-[#ECEFED]">
      <table className="w-full text-[13px]">
        <thead className="bg-[#F8FAF9] text-xs text-suave">
          <tr>
            {t.colunas.map((c, k) => (
              <th key={c} scope="col" className={k === 0 ? 'px-3 py-2 text-left' : celula}>
                {c}
              </th>
            ))}
            <th scope="col" className="px-3 py-2">
              <span className="sr-only">{t.acoes}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {itens.map((it, i) => (
            <LinhaItem
              key={i}
              it={it}
              apagada={arrastando === i}
              aoEditar={() => aoEditar(i)}
              aoExcluir={() => aoExcluir(i)}
              aoDeslocar={(passo) => aoMover(i, i + passo)}
              arraste={{
                onDragStart: () => setArrastando(i),
                onDragOver: (e) => e.preventDefault(),
                onDrop: () => {
                  if (arrastando !== null) aoMover(arrastando, i)
                },
                onDragEnd: () => setArrastando(null),
              }}
            />
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-[#ECEFED] bg-[#F8FAF9] font-bold text-verde-escuro">
            <th scope="row" className="px-3 py-2 text-left">
              {t.total}
            </th>
            <Numeros n={totalItens(itens)} />
            <td className={celula}>{t.gramas(gramasTotais(itens))}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
