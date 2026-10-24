import { useId } from 'react'
import { REFEICOES, textos } from '../textos'

const t = textos.foto

/** Qual refeição é a foto, em pílulas; as já enviadas hoje ficam apagadas. */
export function CamposRefeicao({
  refeicao,
  setRefeicao,
  enviadas,
}: {
  refeicao: string
  setRefeicao: (v: string) => void
  enviadas: string[]
}) {
  const id = useId()
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-bold text-tinta">{t.qualRefeicao}</legend>
      <div className="flex flex-wrap gap-2">
        {REFEICOES.map((x) => {
          const feita = enviadas.includes(x.id)
          return (
            <label
              key={x.id}
              className={feita ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            >
              <input
                type="radio"
                name={`${id}-refeicao`}
                value={x.id}
                checked={refeicao === x.id}
                disabled={feita}
                onChange={() => setRefeicao(x.id)}
                className="peer sr-only"
              />
              <span
                className={`brilho ${refeicao === x.id ? 'brilho-verde' : 'brilho-cinza'} inline-flex min-h-9 items-center rounded-full px-4 text-[13px] font-bold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ora`}
              >
                {x.nome}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
