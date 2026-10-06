import type { UseFormRegisterReturn } from 'react-hook-form'
import { PLANOS, type Plano, type Precos } from '@/domain/precos'
import { textos } from '../textos'
import { valorDoPlano } from './valores'

type Props = { precos: Precos; plano: Plano; campo: UseFormRegisterReturn<'plano'> }

const t = textos.plano

/** Produto e plano escolhido; dá para trocar o plano aqui mesmo. */
export function Resumo({ precos, plano, campo }: Props) {
  return (
    <section>
      <div className="flex gap-4">
        <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-ora p-3">
          <img
            src="/logo-ora.png"
            alt="ORA"
            width={482}
            height={189}
            className="w-full brightness-0 invert"
          />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-ora">{textos.produto.nome}</h1>
          <p className="text-xs text-suave">{textos.produto.autoras}</p>
          <p className="mt-1 text-xl font-semibold text-tinta">{valorDoPlano(precos, plano)}</p>
          {precos.emOferta ? (
            <p className="mt-1 inline-block rounded-full bg-ora px-3 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-creme uppercase">
              {textos.produto.vantagem}
            </p>
          ) : (
            <p className="text-xs text-suave">{textos.produto.acesso(precos.mesesAcesso)}</p>
          )}
        </div>
      </div>
      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold text-ora">{t.titulo}</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {PLANOS.map((id) => (
            <label
              key={id}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-linha bg-white px-4 py-3 has-checked:border-ora has-checked:ring-1 has-checked:ring-ora"
            >
              <input type="radio" value={id} className="size-4 shrink-0 accent-ora" {...campo} />
              <span className="text-sm">
                <span className="block font-semibold text-ora">{t.opcoes[id].nome}</span>
                <span className="block text-tinta">{valorDoPlano(precos, id)}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
