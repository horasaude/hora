import { useId } from 'react'
import { TIPOS_TREINO, textos } from '../textos'

const t = textos.foto

type Campos = {
  tipoTreino: string
  setTipoTreino: (v: string) => void
  duracao: string
  setDuracao: (v: string) => void
}

/** Tipo de treino em pílulas e a duração opcional. */
export function CamposTreino({ tipoTreino, setTipoTreino, duracao, setDuracao }: Campos) {
  const id = useId()
  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-bold text-tinta">{t.tipo}</legend>
        <div className="flex flex-wrap gap-2">
          {TIPOS_TREINO.map((x) => (
            <label key={x.id} className="cursor-pointer">
              <input
                type="radio"
                name={`${id}-tipo`}
                value={x.id}
                checked={tipoTreino === x.id}
                onChange={() => setTipoTreino(x.id)}
                className="peer sr-only"
              />
              <span
                className={`brilho ${tipoTreino === x.id ? 'brilho-coral' : 'brilho-cinza'} inline-flex min-h-9 items-center rounded-full px-4 text-[13px] font-bold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ora`}
              >
                {x.nome}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor={`${id}-duracao`} className="font-bold text-tinta">
          {t.duracao}
        </label>
        <input
          id={`${id}-duracao`}
          inputMode="numeric"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value.replace(/\D/g, '').slice(0, 3))}
          className="min-h-11 w-32 rounded-xl border border-linha bg-white px-4 focus:border-ora focus:outline-none"
        />
      </div>
    </div>
  )
}
