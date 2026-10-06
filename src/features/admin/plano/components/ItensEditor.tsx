import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import type { Item, Opcao } from '@/domain/nutricao'
import { rotuloOpcao } from '../opcoes'
import { textos } from '../textos'
import { tEscolher, tRefeicoes as t } from '../textos2'
import { EscolherItem } from './EscolherItem'

function LinhaOpcao({ o, ou, aoRemover }: { o: Opcao; ou: boolean; aoRemover: () => void }) {
  return (
    <div className="flex items-center gap-3 py-1.5 text-[13px]">
      {ou && (
        <span className="text-[11px] font-bold tracking-[0.08em] text-suave uppercase">{t.ou}</span>
      )}
      <span className="min-w-0 flex-1">
        <span className="font-bold text-tinta">{o.nome}</span>
        <span className="text-suave"> · {rotuloOpcao(o)}</span>
      </span>
      <span className="shrink-0 text-suave">{textos.kcal(o.nutrientes.kcal)}</span>
      <button
        type="button"
        aria-label={t.removerItem(o.nome)}
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
    </div>
  )
}

type Props = { itens: Item[]; aoMudar: (itens: Item[]) => void }

/** Alimentos da refeição: cada item com a opção principal e as alternativas "ou". */
export function ItensEditor({ itens, aoMudar }: Props) {
  const [escolhendo, setEscolhendo] = useState<number | 'novo' | null>(null)
  const removerOpcao = (i: number, j: number) =>
    aoMudar(
      itens
        .map((it, k) => (k === i ? { opcoes: it.opcoes.filter((_, x) => x !== j) } : it))
        .filter((it) => it.opcoes.length > 0),
    )
  const adicionar = (o: Opcao) =>
    escolhendo === 'novo'
      ? aoMudar([...itens, { opcoes: [o] }])
      : aoMudar(itens.map((it, k) => (k === escolhendo ? { opcoes: [...it.opcoes, o] } : it)))
  return (
    <div className="flex flex-col gap-2">
      {itens.length === 0 && <p className="text-[13px] text-suave">{t.semAlimentos}</p>}
      {itens.map((it, i) => (
        <div key={i} className="rounded-xl border border-[#ECEFED] px-3.5 py-2">
          {it.opcoes.map((o, j) => (
            <LinhaOpcao
              key={`${o.ref_id}-${j}`}
              o={o}
              ou={j > 0}
              aoRemover={() => removerOpcao(i, j)}
            />
          ))}
          <button
            type="button"
            onClick={() => setEscolhendo(i)}
            className="mt-1 min-h-8 text-xs font-bold text-verde-escuro underline underline-offset-4"
          >
            + {t.adicionarOu}
          </button>
        </div>
      ))}
      <BotaoBrilho tom="dourado" className="self-start" onClick={() => setEscolhendo('novo')}>
        + {t.adicionarAlimento}
      </BotaoBrilho>
      {escolhendo !== null && (
        <EscolherItem
          titulo={escolhendo === 'novo' ? tEscolher.titulo : tEscolher.tituloOu}
          aoEscolher={adicionar}
          aoFechar={() => setEscolhendo(null)}
        />
      )}
    </div>
  )
}
