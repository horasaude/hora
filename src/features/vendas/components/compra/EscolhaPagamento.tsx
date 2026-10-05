import type { UseFormRegisterReturn } from 'react-hook-form'
import { textos } from '../../textos'
import type { OpcaoPagamento } from './opcoes'

type Props = { opcoes: OpcaoPagamento[]; campo: UseFormRegisterReturn<'plano'>; erro?: string }

export function EscolhaPagamento({ opcoes, campo, erro }: Props) {
  return (
    <fieldset aria-describedby={erro ? 'erro-plano' : undefined}>
      <legend className="mb-3 text-[0.7rem] font-semibold tracking-[0.2em] text-ora uppercase">
        {textos.compra.plano}
      </legend>
      <div className="flex flex-col gap-2">
        {opcoes.map((o) => (
          <label
            key={o.plano}
            className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-linha bg-white px-4 py-2 has-checked:border-ora has-checked:ring-1 has-checked:ring-ora"
          >
            <input type="radio" value={o.plano} className="size-5 shrink-0 accent-ora" {...campo} />
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-titulo text-2xl text-ora">{o.valor}</span>
              <span className="text-sm font-light text-suave italic">{o.rotulo}</span>
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
