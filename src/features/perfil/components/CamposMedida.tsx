import { useId } from 'react'
import { CAMPOS_MEDIDA, type CampoMedida } from '../api/medidas.api'
import { mascaraDecimal } from '../schemas/medida.schema'
import { textos } from '../textos'

const entrada =
  'min-h-11 w-full rounded-xl border border-linha bg-white px-4 focus:border-ora focus:outline-none'

type Props = {
  hoje: string
  dia: string
  setDia: (v: string) => void
  valores: Record<CampoMedida, string>
  setValor: (c: CampoMedida, v: string) => void
}

/** Data e as cinco medidas, com vírgula enquanto digita. */
export function CamposMedida({ hoje, dia, setDia, valores, setValor }: Props) {
  const id = useId()
  return (
    <>
      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor={`${id}-dia`} className="font-bold">
          {textos.evolucao.data}
        </label>
        <input
          id={`${id}-dia`}
          type="date"
          max={hoje}
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          className={entrada}
        />
      </div>
      {CAMPOS_MEDIDA.map((c) => (
        <div key={c} className="flex flex-col gap-1 text-sm">
          <label htmlFor={`${id}-${c}`} className="font-bold">
            {textos.campos[c].nome} ({textos.campos[c].unidade})
          </label>
          <input
            id={`${id}-${c}`}
            inputMode="decimal"
            value={valores[c]}
            onChange={(e) => setValor(c, mascaraDecimal(e.target.value))}
            className={entrada}
          />
        </div>
      ))}
    </>
  )
}
