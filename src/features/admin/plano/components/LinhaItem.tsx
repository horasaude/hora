import type { DragEvent } from 'react'
import type { Item, Nutrientes, Opcao } from '@/domain/nutricao'
import { rotuloOpcao } from '../opcoes'
import { tEditor as t } from '../textosRefeicao'
import { IconeArrastar, IconeEditar, IconeRemover } from './Icones'

export const celula = 'px-3 py-2 text-right whitespace-nowrap'
const botao = 'grid size-8 place-items-center rounded-full hover:bg-trilho'
const quantidade = (o: Opcao) => (o.tipo === 'alimento' ? t.gramas(o.gramas) : rotuloOpcao(o))

/** Proteínas, carboidratos, lipídeos e calorias em células. */
export function Numeros({ n }: { n: Nutrientes }) {
  return (
    <>
      <td className={celula}>{t.gramas(n.proteina)}</td>
      <td className={celula}>{t.gramas(n.carboidrato)}</td>
      <td className={celula}>{t.gramas(n.gordura)}</td>
      <td className={celula}>{t.kcal(n.kcal)}</td>
    </>
  )
}

/** Alimento principal e, na mesma linha, os substitutos "ou". */
function Nome({ it }: { it: Item }) {
  return (
    <td className="min-w-56 px-3 py-2">
      {it.opcoes.map((o, j) => (
        <span key={j}>
          {j > 0 && <span className="text-suave"> {t.ou} </span>}
          <span className={j === 0 ? 'font-bold text-tinta' : 'text-tinta'}>{o.nome}</span>
          <span className="text-suave"> ({rotuloOpcao(o)})</span>
        </span>
      ))}
    </td>
  )
}

type Props = {
  it: Item
  apagada: boolean
  aoEditar: () => void
  aoExcluir: () => void
  /** -1 sobe, 1 desce (pelo teclado na alça). */
  aoDeslocar: (passo: number) => void
  arraste: {
    onDragStart: () => void
    onDragOver: (e: DragEvent) => void
    onDrop: () => void
    onDragEnd: () => void
  }
}

/** Linha da tabela: alimento, macros, quantidade, editar, excluir e alça de reordenar. */
export function LinhaItem({ it, apagada, aoEditar, aoExcluir, aoDeslocar, arraste }: Props) {
  const o = it.opcoes[0]
  if (!o) return null
  return (
    <tr
      draggable
      {...arraste}
      className={`border-t border-[#F4F5F4] ${apagada ? 'opacity-50' : ''}`}
    >
      <Nome it={it} />
      <Numeros n={o.nutrientes} />
      <td className={celula}>{quantidade(o)}</td>
      <td className="px-2 py-1">
        <span className="flex justify-end">
          <button
            type="button"
            aria-label={t.editar(o.nome)}
            title={t.editar(o.nome)}
            onClick={aoEditar}
            className={`${botao} text-verde-escuro`}
          >
            <IconeEditar />
          </button>
          <button
            type="button"
            aria-label={t.excluir(o.nome)}
            title={t.excluir(o.nome)}
            onClick={aoExcluir}
            className={`${botao} text-terracota-escuro`}
          >
            <IconeRemover />
          </button>
          <button
            type="button"
            aria-label={t.arrastar(o.nome)}
            title={t.arrastar(o.nome)}
            onKeyDown={(e) => {
              const passo = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0
              if (!passo) return
              e.preventDefault()
              aoDeslocar(passo)
            }}
            className={`${botao} cursor-grab text-suave`}
          >
            <IconeArrastar />
          </button>
        </span>
      </td>
    </tr>
  )
}
