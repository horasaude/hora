import { caixa } from './caixa'

export function Numero({
  rotulo,
  valor,
  aoMudar,
  max,
}: {
  rotulo: string
  valor: number
  aoMudar: (n: number) => void
  max: number
}) {
  return (
    <label className="flex flex-col gap-0.5 text-[11px] text-suave">
      {rotulo}
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={valor}
        onChange={(e) => aoMudar(Math.max(0, Math.min(max, Number(e.target.value) || 0)))}
        className={caixa}
      />
    </label>
  )
}

export function Texto({
  rotulo,
  valor,
  aoMudar,
  max,
}: {
  rotulo: string
  valor: string
  aoMudar: (v: string) => void
  max: number
}) {
  return (
    <label className="flex flex-col gap-0.5 text-[11px] text-suave">
      {rotulo}
      <input
        value={valor}
        maxLength={max}
        onChange={(e) => aoMudar(e.target.value)}
        className={caixa}
      />
    </label>
  )
}
