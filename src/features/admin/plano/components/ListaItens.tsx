import type { Item } from '@/domain/nutricao'
import { rotuloOpcao } from '../opcoes'
import { textos } from '../textos'
import { tRefeicoes } from '../textos2'

/** Um alimento por linha, com medida caseira; os substitutos "ou" na mesma linha. */
export function ListaItens({ itens, texto }: { itens: Item[]; texto?: string }) {
  if (texto !== undefined)
    return <p className="text-[13px] leading-relaxed whitespace-pre-line text-[#40504B]">{texto}</p>
  return (
    <ul className="flex flex-col gap-1 text-[13px]">
      {itens.map((it, i) => (
        <li key={i} className="flex justify-between gap-3 text-tinta">
          <span>
            {it.opcoes.map((o, j) => (
              <span key={j}>
                {j > 0 && <span className="text-suave"> {tRefeicoes.ou} </span>}
                {o.nome} <span className="text-suave">({rotuloOpcao(o)})</span>
              </span>
            ))}
          </span>
          {it.opcoes[0] && (
            <span className="shrink-0 text-suave">{textos.kcal(it.opcoes[0].nutrientes.kcal)}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
