import { percentualDesconto } from '@/domain/loja'
import { formatarPreco } from '@/lib/moeda'
import { CampoDinheiro } from '../../components/CampoDinheiro'
import { precoFinal, type Preco } from '../formulario'
import { t } from '../textos'

/** Preço, desconto em % ou preço final, e o resultado calculado. */
export function CamposPreco({ p, mudar }: { p: Preco; mudar: (x: Partial<Preco>) => void }) {
  const final = precoFinal(p)
  return (
    <>
      <CampoDinheiro
        rotulo={t.produto.preco}
        valor={p.preco}
        aoMudar={(preco) => mudar({ preco })}
      />
      <fieldset className="flex flex-col gap-1 text-sm">
        <legend className="mb-1 font-medium">{t.produto.modo}</legend>
        <div className="flex gap-1.5">
          {(['pct', 'final'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={p.modo === m}
              onClick={() => mudar({ modo: m })}
              className={`min-h-10 rounded-full px-4 text-[13px] font-bold ${p.modo === m ? 'brilho brilho-verde' : 'border border-linha bg-white text-suave'}`}
            >
              {t.produto.modos[m]}
            </button>
          ))}
        </div>
      </fieldset>
      {p.modo === 'pct' ? (
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.produto.pct}</span>
          <input
            inputMode="numeric"
            value={p.pct}
            onChange={(e) => mudar({ pct: e.target.value.replace(/\D/g, '').slice(0, 2) })}
            className="min-h-12 rounded-xl border border-linha bg-white px-4"
          />
        </label>
      ) : (
        <CampoDinheiro
          rotulo={t.produto.final}
          valor={p.final}
          aoMudar={(v) => mudar({ final: v })}
        />
      )}
      <p className="self-end pb-3 text-[13px] text-suave">
        {p.preco > 0 &&
          t.produto.resultado(percentualDesconto(p.preco, final), formatarPreco(final))}
      </p>
    </>
  )
}
