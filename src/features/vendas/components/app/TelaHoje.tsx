import { textos } from '../../textos'

const t = textos.app.hoje

type Props = { feitos: boolean[]; alternar: (i: number) => void }

/** Tela Hoje: próxima live e hábitos do dia, que dá para marcar. */
export function TelaHoje({ feitos, alternar }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl bg-ora p-4 text-creme">
        <p className="text-[0.6rem] font-semibold tracking-[0.16em] text-creme/70 uppercase">
          {t.live.rotulo}
        </p>
        <p className="mt-1 font-titulo text-xl leading-tight">{t.live.tema}</p>
        <p className="mt-1 text-[0.7rem] text-creme/80">{t.live.quando}</p>
        <span className="mt-3 block rounded-xl bg-creme py-2 text-center text-[0.7rem] font-semibold text-ora">
          {t.live.botao}
        </span>
      </div>
      <div className="rounded-2xl border border-linha bg-white p-3">
        <p className="mb-1 text-[0.65rem] font-semibold tracking-[0.12em] text-suave uppercase">
          {t.habitosTitulo}
        </p>
        <ul>
          {t.habitos.map((h, i) => {
            const feito = feitos[i] ?? false
            return (
              <li key={h.nome} className="border-b border-dashed border-linha last:border-0">
                <button
                  type="button"
                  onClick={() => alternar(i)}
                  aria-pressed={feito}
                  className="flex w-full items-center gap-2 py-2 text-left"
                >
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-lg border-2 transition ${feito ? 'border-salvia bg-salvia' : 'border-linha bg-white'}`}
                  >
                    {feito && (
                      <span className="mb-0.5 h-2.5 w-1.5 rotate-45 border-r-2 border-b-2 border-white" />
                    )}
                  </span>
                  <span
                    className={`flex-1 text-xs font-medium ${feito ? 'text-suave line-through' : 'text-tinta'}`}
                  >
                    {h.nome}
                  </span>
                  <span className="rounded-full bg-creme px-2 py-0.5 text-[0.6rem] font-semibold text-ora">
                    +{h.pts}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
