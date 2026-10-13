import { useState } from 'react'
import type { ItemTreino } from '../api/treinos.api'
import { t } from '../textos'
import { Numero, Texto } from './CamposItem'

type Props = { itens: ItemTreino[]; mudar: (itens: ItemTreino[]) => void }

function Cabecalho({ item, i, props }: { item: ItemTreino; i: number; props: Props }) {
  const { itens, mudar } = props
  return (
    <div className="flex items-center gap-2">
      <span
        aria-label={t.itens.arrastar}
        title={t.itens.arrastar}
        className="cursor-grab text-suave"
      >
        ⋮⋮
      </span>
      <span className="flex-1 text-sm font-bold text-tinta">
        {i + 1}. {item.nome}
      </span>
      <button
        type="button"
        onClick={() =>
          mudar([
            ...itens.slice(0, i + 1),
            { ...item, chave: crypto.randomUUID() },
            ...itens.slice(i + 1),
          ])
        }
        className="min-h-8 rounded-full px-2 text-xs font-bold text-verde-escuro underline"
        aria-label={t.itens.duplicar(item.nome)}
      >
        {t.duplicarCurto}
      </button>
      <button
        type="button"
        onClick={() => mudar(itens.filter((_, j) => j !== i))}
        className="min-h-8 rounded-full px-2 text-xs font-bold text-terracota-escuro underline"
        aria-label={t.itens.remover(item.nome)}
      >
        {t.remover}
      </button>
    </div>
  )
}

function Linha({ item, i, props }: { item: ItemTreino; i: number; props: Props }) {
  const { itens, mudar } = props
  const trocar = (campos: Partial<ItemTreino>) =>
    mudar(itens.map((x, j) => (j === i ? { ...x, ...campos } : x)))
  return (
    <div className="flex flex-col gap-2">
      <Cabecalho item={item} i={i} props={props} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Numero
          rotulo={t.itens.series}
          valor={item.series}
          max={20}
          aoMudar={(series) => trocar({ series })}
        />
        <Texto
          rotulo={t.itens.repeticoes}
          valor={item.repeticoes}
          max={40}
          aoMudar={(repeticoes) => trocar({ repeticoes })}
        />
        <Texto
          rotulo={t.itens.carga}
          valor={item.carga}
          max={80}
          aoMudar={(carga) => trocar({ carga })}
        />
        <Numero
          rotulo={t.itens.descanso}
          valor={item.descanso_segundos}
          max={600}
          aoMudar={(descanso_segundos) => trocar({ descanso_segundos })}
        />
      </div>
      <Texto
        rotulo={t.itens.observacao}
        valor={item.observacao}
        max={300}
        aoMudar={(observacao) => trocar({ observacao })}
      />
    </div>
  )
}

/** Exercícios do treino: arrastar para reordenar, duplicar, remover e ajustar cada linha. */
export function ItensTreino(props: Props) {
  const { itens, mudar } = props
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
          <Linha item={item} i={i} props={props} />
        </li>
      ))}
    </ol>
  )
}
