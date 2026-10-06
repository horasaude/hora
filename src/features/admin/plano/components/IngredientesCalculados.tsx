import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { macros, porPorcao, type Por100 } from '@/domain/nutricao'
import { textos } from '../textos'
import { tEscolher, tRefeicoes, tReceitas as t } from '../textos2'
import { EscolherItem } from './EscolherItem'

export type IngredienteLocal = { alimento_id: string; nome: string; gramas: number; por100: Por100 }

function Linha({
  i,
  aoGramas,
  aoRemover,
}: {
  i: IngredienteLocal
  aoGramas: (g: number) => void
  aoRemover: () => void
}) {
  return (
    <li className="flex items-center gap-2 px-3 py-2 text-[13px]">
      <span className="min-w-0 flex-1 font-bold text-tinta">{i.nome}</span>
      <input
        aria-label={`${i.nome} (g)`}
        inputMode="decimal"
        value={i.gramas}
        onChange={(e) => aoGramas(Number(e.target.value.replace(',', '.')) || 0)}
        className="w-16 rounded-lg border border-linha px-2 py-1 text-right"
      />
      <span className="text-suave">g</span>
      <button
        type="button"
        aria-label={tRefeicoes.removerItem(i.nome)}
        onClick={aoRemover}
        className="grid size-7 place-items-center rounded-full text-terracota-escuro hover:bg-trilho"
      >
        <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
          <path
            d="m4 4 8 8m0-8-8 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  )
}

/** Ingredientes da lista de alimentos com gramas, e kcal e macros por porção. */
export function IngredientesCalculados({
  itens,
  porcoes,
  aoMudar,
}: {
  itens: IngredienteLocal[]
  porcoes: number
  aoMudar: (i: IngredienteLocal[]) => void
}) {
  const [escolhendo, setEscolhendo] = useState(false)
  const porcao = porPorcao(
    itens.map((i) => ({ por100: i.por100, gramas: i.gramas })),
    porcoes,
  )
  const m = macros(porcao)
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col divide-y divide-[#F4F5F4] rounded-xl border border-[#ECEFED]">
        {itens.map((i, k) => (
          <Linha
            key={`${i.alimento_id}-${k}`}
            i={i}
            aoGramas={(g) => aoMudar(itens.map((x, j) => (j === k ? { ...x, gramas: g } : x)))}
            aoRemover={() => aoMudar(itens.filter((_, j) => j !== k))}
          />
        ))}
      </ul>
      <BotaoBrilho tom="dourado" className="self-start" onClick={() => setEscolhendo(true)}>
        + {tRefeicoes.adicionarAlimento}
      </BotaoBrilho>
      <div className="rounded-xl bg-[#F8FAF9] p-3 text-[13px] text-[#40504B]">
        <p className="font-bold text-verde-escuro">
          {t.porPorcao}: {textos.kcal(porcao.kcal)}
        </p>
        <p>
          P {Math.round(m.proteina.gramas)} g · C {Math.round(m.carboidrato.gramas)} g · G{' '}
          {Math.round(m.gordura.gramas)} g
        </p>
      </div>
      {escolhendo && (
        <EscolherItem
          soAlimentos
          titulo={tEscolher.titulo}
          aoFechar={() => setEscolhendo(false)}
          aoEscolher={(o, por100) =>
            por100 &&
            aoMudar([...itens, { alimento_id: o.ref_id, nome: o.nome, gramas: o.gramas, por100 }])
          }
        />
      )}
    </div>
  )
}
