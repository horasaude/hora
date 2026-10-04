import type { UseFormRegisterReturn } from 'react-hook-form'
import { textos } from '../textos'
import type { OpcaoPreco } from './opcoes'

type Props = { opcoes: OpcaoPreco[]; campo: UseFormRegisterReturn<'plano'>; erro?: string }

/** Os cartões de preço viram as opções do formulário. */
export function EscolhaPlano({ opcoes, campo, erro }: Props) {
  return (
    <fieldset aria-invalid={Boolean(erro)} aria-describedby={erro ? 'erro-plano' : undefined}>
      <legend className="mb-3 font-semibold text-tinta">{textos.cadastro.plano}</legend>
      <div className="flex flex-col gap-3">
        {opcoes.map((o) => (
          <label
            key={o.plano}
            className="flex cursor-pointer items-center gap-4 rounded-lg border border-linha bg-white p-5 has-checked:border-2 has-checked:border-ora"
          >
            <input type="radio" value={o.plano} className="size-5 accent-ora" {...campo} />
            <span>
              <span className="block font-titulo text-3xl text-ora">{o.valor}</span>
              <span className="mt-1 block text-suave">{o.rotulo}</span>
            </span>
          </label>
        ))}
      </div>
      {erro && (
        <p id="erro-plano" className="mt-2 text-sm text-terracota">
          {erro}
        </p>
      )}
    </fieldset>
  )
}
