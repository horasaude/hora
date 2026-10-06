import { totalCardapio, totalItens, type Refeicao } from '@/domain/nutricao'
import { textos } from '../textos'
import { tCardapios as t } from '../textos2'
import { Bloco } from './BarraTopo'
import { Rosca } from './Rosca'

/** Resumo do dia, fixo ao rolar: rosca dos macros, kcal total e kcal de cada refeição. */
export function ResumoNutrientes({ refeicoes }: { refeicoes: Refeicao[] }) {
  return (
    <Bloco titulo={t.resumo} className="lg:sticky lg:top-6">
      <Rosca total={totalCardapio(refeicoes)} />
      {refeicoes.length > 0 && (
        <div className="border-t border-[#F0F2F1] pt-3">
          <p className="mb-1.5 text-[11px] font-bold tracking-[0.08em] text-[#8A9692] uppercase">
            {t.porRefeicao}
          </p>
          <ul className="flex flex-col gap-1 text-[13px]">
            {refeicoes.map((r) => (
              <li key={r.id} className="flex justify-between gap-3">
                <span className="text-[#40504B]">{r.nome}</span>
                <span className="font-bold text-tinta">
                  {textos.kcal(totalItens(r.itens).kcal)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Bloco>
  )
}
