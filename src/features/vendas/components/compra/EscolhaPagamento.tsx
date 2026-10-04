import type { UseFormRegisterReturn } from 'react-hook-form'
import { textos } from '../../textos'
import type { OpcaoPagamento } from './opcoes'

type Props = { opcoes: OpcaoPagamento[]; campo: UseFormRegisterReturn<'plano'>; erro?: string }

export function EscolhaPagamento({ opcoes, campo, erro }: Props) {
  return (
    <fieldset aria-describedby={erro ? 'erro-plano' : undefined}>
      <legend className="mb-2 text-sm font-semibold text-tinta">{textos.compra.plano}</legend>
      <div className="flex flex-col gap-2">
        {opcoes.map((o) => (
          <label
            key={o.plano}
            className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-linha px-4 py-2 has-checked:border-2 has-checked:border-ora has-checked:bg-areia"
          >
            <input type="radio" value={o.plano} className="size-5 shrink-0 accent-ora" {...campo} />
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-titulo text-xl font-semibold text-ora">{o.valor}</span>
              <span className="text-sm text-suave">{o.rotulo}</span>
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
