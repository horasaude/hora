import { t } from '../textos'

/** Campo da regra Água: a meta diária em ml que as alunas vão somando copo a copo. */
export function CampoMetaAgua({ valor, mudar }: { valor: string; mudar: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-3">
      {t.agua.rotulo}
      <span className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={500}
          max={6000}
          step={50}
          value={valor}
          onChange={(e) => mudar(e.target.value)}
          className="min-h-11 w-36 rounded-xl border border-linha bg-white px-3 focus:border-ora focus:outline-none"
        />
        <span className="text-suave">ml</span>
      </span>
      <span className="text-xs font-normal text-suave">{t.agua.ajuda}</span>
    </label>
  )
}
