import type { ExercicioDoTreino } from '../api/treinos.api'
import { textos } from '../textos'
import { Midia } from './Midia'

const t = textos.execucao

type Props = { item: ExercicioDoTreino; feitas: number; aoTocar: (serie: number) => void }

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

/** Um exercício: demonstração, nome, séries x repetições, carga, instruções recolhíveis e as séries. */
export function PassoExercicio({ item, feitas, aoTocar }: Props) {
  const e = item.exercicio
  return (
    <article className="flex flex-col gap-4">
      <Midia nome={e.nome} video={e.video_url} foto={e.foto_path} />
      <header>
        <h2 className="text-[24px] leading-tight font-bold text-verde-escuro">{e.nome}</h2>
        <p className="mt-1 text-[17px] font-bold text-coral">
          {t.series(item.series, item.repeticoes)}
        </p>
        {item.carga && <p className="text-sm text-suave">{t.carga(item.carga)}</p>}
        {item.observacao && <p className="mt-1 text-sm text-tinta">{item.observacao}</p>}
      </header>
      <Series total={item.series} feitas={feitas} aoTocar={aoTocar} />
      {(e.instrucoes || e.erros_comuns) && (
        <details className="rounded-[18px] bg-trilho px-4 py-3 text-sm text-tinta">
          <summary className="min-h-8 cursor-pointer font-bold text-verde-escuro">
            {t.instrucoes}
          </summary>
          {e.instrucoes && <p className="mt-2 whitespace-pre-line">{e.instrucoes}</p>}
          {e.erros_comuns && (
            <>
              <p className="mt-3 font-bold">{t.erros}</p>
              <p className="whitespace-pre-line">{e.erros_comuns}</p>
            </>
          )}
        </details>
      )}
    </article>
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
