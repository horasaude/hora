import { macros, type Nutrientes } from '@/domain/nutricao'
import { tEditor as t } from '../textosRefeicao'

/** "Ver nutrientes": energia, macros com a porcentagem das calorias e fibras da refeição. */
export function NutrientesRefeicao({ n }: { n: Nutrientes }) {
  const m = macros(n)
  const linhas: [string, string][] = [
    [t.energia, t.kcal(n.kcal)],
    [t.proteinas, `${t.gramas(m.proteina.gramas)} · ${t.pct(m.proteina.pct)}`],
    [t.carboidratos, `${t.gramas(m.carboidrato.gramas)} · ${t.pct(m.carboidrato.pct)}`],
    [t.lipideos, `${t.gramas(m.gordura.gramas)} · ${t.pct(m.gordura.pct)}`],
    [t.fibras, t.gramas(n.fibra)],
  ]
  return (
    <dl className="grid grid-cols-2 gap-2 rounded-xl bg-[#F8FAF9] p-3 text-[13px] sm:grid-cols-5">
      {linhas.map(([rotulo, valor]) => (
        <div key={rotulo} className="flex flex-col">
          <dt className="text-xs text-suave">{rotulo}</dt>
          <dd className="font-bold text-tinta">{valor}</dd>
        </div>
      ))}
    </dl>
  )
}
