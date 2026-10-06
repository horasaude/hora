import { macros, type Nutrientes } from '@/domain/nutricao'
import { textos } from '../textos'

// Cores do gráfico: proteína coral, carboidrato dourado, gordura sálvia.
const FATIAS = [
  { chave: 'proteina', cor: '#F2643A' },
  { chave: 'carboidrato', cor: '#F2A922' },
  { chave: 'gordura', cor: '#6E9A86' },
] as const

const fmt = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })

/** Rosca de proteína, carboidrato e gordura (gramas e %) com as kcal no centro. */
export function Rosca({ total }: { total: Nutrientes }) {
  const m = macros(total)
  const r = 15.9155
  // Cada fatia começa onde a anterior terminou (25 = topo do círculo).
  const inicios = FATIAS.map(
    (_, i) => 25 - FATIAS.slice(0, i).reduce((t, f) => t + m[f.chave].pct, 0),
  )
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative size-44">
        <svg
          viewBox="0 0 42 42"
          className="size-full"
          role="img"
          aria-label={`${Math.round(total.kcal)} kcal`}
        >
          <circle cx="21" cy="21" r={r} fill="none" stroke="#EEF1EF" strokeWidth="5" />
          {FATIAS.map((f, i) => (
            <circle
              key={f.chave}
              cx="21"
              cy="21"
              r={r}
              fill="none"
              stroke={f.cor}
              strokeWidth="5"
              strokeDasharray={`${m[f.chave].pct} ${100 - m[f.chave].pct}`}
              strokeDashoffset={inicios[i]}
            />
          ))}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[26px] leading-none font-bold text-verde-escuro">
              {Math.round(total.kcal)}
            </p>
            <p className="text-xs text-suave">kcal</p>
          </div>
        </div>
      </div>
      <ul className="flex w-full flex-col gap-1.5 text-[13px]">
        {FATIAS.map((f) => (
          <li key={f.chave} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: f.cor }} aria-hidden />
            <span className="flex-1 text-[#40504B]">{textos.macros[f.chave]}</span>
            <span className="font-bold text-tinta">{fmt(m[f.chave].gramas)} g</span>
            <span className="w-10 text-right text-suave">{m[f.chave].pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
