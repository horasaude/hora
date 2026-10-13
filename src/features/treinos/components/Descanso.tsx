import { useEffect, useState } from 'react'
import {
  descansoAcabou,
  formatarTempo,
  restanteDescanso,
  type Descanso as D,
} from '@/domain/cronometro'
import { textos } from '../textos'

const t = textos.execucao

/** Bipe curto ao fim do descanso (Web Audio; sem arquivo de som). */
function bipe() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const vol = ctx.createGain()
    osc.frequency.value = 880
    vol.gain.value = 0.15
    osc.connect(vol).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.25)
    osc.onended = () => void ctx.close()
  } catch {
    // navegador sem áudio: segue em silêncio
  }
}

function Anel({ pct, restante }: { pct: number; restante: number }) {
  return (
    <div
      className="grid size-16 shrink-0 place-items-center rounded-full text-lg font-bold text-verde-escuro"
      style={{ background: `conic-gradient(#f2643a ${pct}%, #fde2d6 0)` }}
    >
      <span className="grid size-13 place-items-center rounded-full bg-white">
        {formatarTempo(restante)}
      </span>
    </div>
  )
}

/** Cronômetro de descanso com contagem regressiva, aviso sonoro opcional e pular. */
export function Descanso({
  d,
  som,
  aoMudarSom,
  aoFechar,
}: {
  d: D
  som: boolean
  aoMudarSom: (s: boolean) => void
  aoFechar: () => void
}) {
  const [agora, setAgora] = useState(() => Date.now())
  const restante = restanteDescanso(d, agora)
  useEffect(() => {
    const id = window.setInterval(() => setAgora(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [])
  const acabou = descansoAcabou(d, agora)
  useEffect(() => {
    if (!acabou) return
    if (som) bipe()
    const id = window.setTimeout(aoFechar, 800)
    return () => window.clearTimeout(id)
  }, [acabou, som, aoFechar])
  const pct = Math.round(((d.total - restante) / d.total) * 100)
  return (
    <div
      role="timer"
      aria-live="polite"
      className="flex items-center gap-4 rounded-[20px] bg-[#FFF1EA] p-4"
    >
      <Anel pct={pct} restante={restante} />
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-sm font-bold text-tinta">{t.descanso}</span>
        <label className="flex items-center gap-2 text-[13px] text-suave">
          <input
            type="checkbox"
            checked={som}
            onChange={(e) => aoMudarSom(e.target.checked)}
            className="size-4 accent-coral"
          />
          {t.som}
        </label>
      </div>
      <button
        type="button"
        onClick={aoFechar}
        className="min-h-10 text-[13px] font-bold text-verde-escuro underline"
      >
        {t.pular}
      </button>
    </div>
  )
}
