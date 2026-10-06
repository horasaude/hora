import type { Item } from '@/domain/nutricao'
import { rotuloOpcao } from '../opcoes'
import { textos } from '../textos'
import { tRefeicoes } from '../textos2'

/** Itens com medida caseira; o "ou" aparece logo abaixo da opção principal. */
export function ListaItens({ itens, texto }: { itens: Item[]; texto?: string }) {
  if (texto !== undefined)
    return <p className="text-[13px] leading-relaxed whitespace-pre-line text-[#40504B]">{texto}</p>
  return (
    <ul className="flex flex-col gap-1 text-[13px]">
      {itens.map((it, i) => (
        <li key={i}>
          {it.opcoes.map((o, j) => (
            <p
              key={j}
              className={`flex justify-between gap-3 ${j > 0 ? 'pl-4 text-suave' : 'text-tinta'}`}
            >
              <span>
                {j > 0 && <b className="mr-1 text-[11px] uppercase">{tRefeicoes.ou}</b>}
                {o.nome} <span className="text-suave">· {rotuloOpcao(o)}</span>
              </span>
              <span className="shrink-0 text-suave">{textos.kcal(o.nutrientes.kcal)}</span>
            </p>
          ))}
        </li>
      ))}
    </ul>
  )
}
