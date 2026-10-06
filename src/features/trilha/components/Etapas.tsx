import type { EtapaTrilha } from '@/domain/trilha'

type Props = { etapas: EtapaTrilha[]; ativa: string; aoEscolher: (id: string) => void }

/** Etapas do tema em abas; a escolhida fica verde escura. */
export function AbasEtapas({ etapas, ativa, aoEscolher }: Props) {
  return (
    <div role="tablist" className="grid auto-cols-fr grid-flow-col gap-2">
      {etapas.map((e) => (
        <button
          key={e.id}
          type="button"
          role="tab"
          aria-selected={e.id === ativa}
          onClick={() => aoEscolher(e.id)}
          className={`min-h-12 rounded-xl border px-2 text-xs leading-tight font-semibold ${e.id === ativa ? 'border-ora bg-ora text-white' : 'border-linha bg-areia text-suave'}`}
        >
          {e.titulo}
        </button>
      ))}
    </div>
  )
}

/** Barra de progresso sálvia com a legenda embaixo. */
export function BarraProgresso({ pct, legenda }: { pct: number; legenda: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={legenda}
        className="h-2.5 overflow-hidden rounded-full bg-linha"
      >
        <div className="h-full rounded-full bg-salvia" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-suave">{legenda}</p>
    </div>
  )
}
