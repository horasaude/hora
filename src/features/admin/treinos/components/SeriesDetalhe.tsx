import { replicarSeries, type Serie } from '@/domain/series'
import type { ItemTreino } from '../api/treinos.api'
import { t } from '../textos'
import { Numero, Texto } from './CamposItem'
import { useRotulos } from './rotulos'

type Props = { series: Serie[]; mudar: (series: Serie[]) => void }

/** Série por série: repetições (ou tempo), carga e descanso de cada uma; adicionar, replicar e remover. */
export function SeriesDetalhe({ series, mudar }: Props) {
  const r = useRotulos()
  const trocar = (i: number, campos: Partial<Serie>) =>
    mudar(series.map((s, j) => (j === i ? { ...s, ...campos } : s)))
  return (
    <div className="flex flex-col gap-2">
      <ol className="flex flex-col gap-2">
        {series.map((s, i) => (
          <li key={i} className="grid grid-cols-[auto_1fr_1fr_1fr_auto] items-end gap-2">
            <span className="pb-3 text-xs font-bold text-coral">{i + 1}</span>
            <Texto
              rotulo={r.repeticoes}
              valor={s.repeticoes}
              max={40}
              aoMudar={(repeticoes) => trocar(i, { repeticoes })}
            />
            <Texto
              rotulo={r.carga}
              valor={s.carga}
              max={80}
              aoMudar={(carga) => trocar(i, { carga })}
            />
            <Numero
              rotulo={r.descanso}
              valor={s.descanso_segundos}
              max={600}
              aoMudar={(descanso_segundos) => trocar(i, { descanso_segundos })}
            />
            <button
              type="button"
              disabled={series.length === 1}
              onClick={() => mudar(series.filter((_, j) => j !== i))}
              aria-label={t.itens.removerSerie(i + 1)}
              className="mb-1 grid size-8 place-items-center rounded-full text-terracota-escuro disabled:opacity-30"
            >
              ×
            </button>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={series.length >= 20}
          onClick={() => mudar([...series, { ...(series[series.length - 1] as Serie) }])}
          className="brilho brilho-verde inline-flex min-h-8 items-center rounded-full px-3 text-xs font-bold"
        >
          + {t.itens.adicionarSerie}
        </button>
        <button
          type="button"
          onClick={() => mudar(replicarSeries(series))}
          className="inline-flex min-h-8 items-center rounded-full border border-ora px-3 text-xs font-bold text-ora"
        >
          {t.itens.replicar}
        </button>
      </div>
    </div>
  )
}

/** Séries iguais: quantas, repetições, carga e descanso numa linha só. */
export function CamposSimples({
  item,
  trocar,
}: {
  item: ItemTreino
  trocar: (campos: Partial<ItemTreino>) => void
}) {
  const r = useRotulos()
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Numero
        rotulo={r.series}
        valor={item.series}
        max={20}
        aoMudar={(series) => trocar({ series })}
      />
      <Texto
        rotulo={r.repeticoes}
        valor={item.repeticoes}
        max={40}
        aoMudar={(repeticoes) => trocar({ repeticoes })}
      />
      <Texto rotulo={r.carga} valor={item.carga} max={80} aoMudar={(carga) => trocar({ carga })} />
      <Numero
        rotulo={r.descanso}
        valor={item.descanso_segundos}
        max={600}
        aoMudar={(descanso_segundos) => trocar({ descanso_segundos })}
      />
    </div>
  )
}

export function Modo({
  detalhado,
  aoMudar,
}: {
  detalhado: boolean
  aoMudar: (d: boolean) => void
}) {
  const classe = (ativo: boolean) =>
    `min-h-7 rounded-full px-3 text-[11px] font-bold ${ativo ? 'brilho brilho-verde' : 'text-suave'}`
  return (
    <div className="flex gap-1 self-start rounded-full bg-trilho p-0.5">
      <button
        type="button"
        aria-pressed={!detalhado}
        onClick={() => aoMudar(false)}
        className={classe(!detalhado)}
      >
        {t.itens.simples}
      </button>
      <button
        type="button"
        aria-pressed={detalhado}
        onClick={() => aoMudar(true)}
        className={classe(detalhado)}
      >
        {t.itens.seriePorSerie}
      </button>
    </div>
  )
}
