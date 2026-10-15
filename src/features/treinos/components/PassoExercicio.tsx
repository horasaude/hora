import { useState } from 'react'
import { resumoSeries, seriesDoItem, type Serie } from '@/domain/series'
import type { ExercicioDoTreino } from '../api/treinos.api'
import { textos } from '../textos'
import { Midia } from './Midia'

const t = textos.execucao

type Props = {
  item: ExercicioDoTreino
  feitas: number
  aoTocar: (serie: number) => void
  aerobico?: boolean
}

/** Bolinhas das séries: toca conforme faz (tocar numa já feita desmarca dali em diante). */
function Series({
  total,
  feitas,
  aoTocar,
}: {
  total: number
  feitas: number
  aoTocar: (s: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: total }, (_, s) => {
        const feita = s < feitas
        return (
          <button
            key={s}
            type="button"
            aria-pressed={feita}
            aria-label={t.serie(s + 1, feita)}
            onClick={() => aoTocar(s)}
            className={`grid size-12 place-items-center rounded-full text-[15px] font-bold transition ${feita ? 'brilho brilho-coral' : 'border-2 border-[#F2B9A3] bg-white text-coral'}`}
          >
            {s + 1}
          </button>
        )
      })}
    </div>
  )
}

/** Série por série, quando a professora mudou repetição, carga ou descanso entre elas. */
function ListaSeries({ series }: { series: Serie[] }) {
  const iguais = series.every(
    (x) => x.repeticoes === series[0]?.repeticoes && x.carga === series[0]?.carga,
  )
  if (iguais) return null
  return (
    <ol className="flex flex-col gap-1 text-sm text-tinta">
      {series.map((x, i) => (
        <li key={i}>{t.linhaSerie(i + 1, x.repeticoes, x.carga, x.descanso_segundos)}</li>
      ))}
    </ol>
  )
}

/** Um exercício: demonstração, nome, séries, carga, alternativo, instruções recolhíveis e as séries. */
export function PassoExercicio({ item, feitas, aoTocar, aerobico = false }: Props) {
  const [usarAlternativo, setUsarAlternativo] = useState(false)
  const e = usarAlternativo && item.alternativo ? item.alternativo : item.exercicio
  const series = seriesDoItem(item)
  return (
    <article className="flex flex-col gap-4">
      <Midia nome={e.nome} video={e.video_url} foto={e.foto_path} />
      <header>
        <h2 className="text-[24px] leading-tight font-bold text-verde-escuro">{e.nome}</h2>
        <p className="mt-1 text-[17px] font-bold text-coral">
          {aerobico ? t.bloco(series.length, item.repeticoes) : resumoSeries(series)}
        </p>
        {item.carga && series.every((x) => x.carga === item.carga) && (
          <p className="text-sm text-suave">
            {aerobico ? t.intensidade(item.carga) : t.carga(item.carga)}
          </p>
        )}
        {item.observacao && <p className="mt-1 text-sm text-tinta">{item.observacao}</p>}
        {item.alternativo && (
          <button
            type="button"
            onClick={() => setUsarAlternativo(!usarAlternativo)}
            className="mt-2 min-h-8 text-sm font-bold text-verde-escuro underline"
          >
            {usarAlternativo
              ? t.principal(item.exercicio.nome)
              : t.alternativo(item.alternativo.nome)}
          </button>
        )}
      </header>
      <ListaSeries series={series} />
      <Series total={series.length} feitas={feitas} aoTocar={aoTocar} />
      <Instrucoes instrucoes={e.instrucoes} erros={e.erros_comuns} />
    </article>
  )
}

function Instrucoes({ instrucoes, erros }: { instrucoes: string; erros: string }) {
  if (!instrucoes && !erros) return null
  return (
    <details className="rounded-[18px] bg-trilho px-4 py-3 text-sm text-tinta">
      <summary className="min-h-8 cursor-pointer font-bold text-verde-escuro">
        {t.instrucoes}
      </summary>
      {instrucoes && <p className="mt-2 whitespace-pre-line">{instrucoes}</p>}
      {erros && (
        <>
          <p className="mt-3 font-bold">{t.erros}</p>
          <p className="whitespace-pre-line">{erros}</p>
        </>
      )}
    </details>
  )
}

/** Aquecimento ou alongamento: um bloco de texto antes ou depois dos exercícios. */
export function PassoTexto({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <article className="flex flex-col gap-3 rounded-[22px] bg-[#FFF1EA] p-5">
      <h2 className="text-[22px] font-bold text-verde-escuro">{titulo}</h2>
      <p className="text-base leading-relaxed whitespace-pre-line text-tinta">{texto}</p>
    </article>
  )
}
