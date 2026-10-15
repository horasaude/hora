import { useState } from 'react'
import type { ItemTreino } from '../api/treinos.api'
import { t } from '../textos'
import { ItemDoTreino } from './ItemDoTreino'

type Props = { itens: ItemTreino[]; mudar: (itens: ItemTreino[]) => void }

/** Exercícios do treino: arrastar para reordenar e, em cada um, séries, trocar, alternativo e remover. */
export function ItensTreino({ itens, mudar }: Props) {
  const [arrastando, setArrastando] = useState<number | null>(null)
  const soltar = (para: number) => {
    if (arrastando === null || arrastando === para) return
    const nova = [...itens]
    const [movido] = nova.splice(arrastando, 1)
    if (movido) nova.splice(para, 0, movido)
    mudar(nova)
    setArrastando(null)
  }
  if (itens.length === 0) return <p className="text-sm text-suave">{t.itens.nenhum}</p>
  return (
    <ol className="flex flex-col gap-2">
      {itens.map((item, i) => (
        <li
          key={item.chave}
          draggable
          onDragStart={() => setArrastando(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => soltar(i)}
          className={`rounded-2xl border bg-white p-3 ${arrastando === i ? 'border-coral' : 'border-[#ECEFED]'}`}
        >
          <ItemDoTreino
            item={item}
            i={i}
            trocar={(campos) => mudar(itens.map((x, j) => (j === i ? { ...x, ...campos } : x)))}
            duplicar={() =>
              mudar([
                ...itens.slice(0, i + 1),
                { ...item, chave: crypto.randomUUID() },
                ...itens.slice(i + 1),
              ])
            }
            remover={() => mudar(itens.filter((_, j) => j !== i))}
          />
        </li>
      ))}
    </ol>
  )
}
