import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { totalItens, type Item } from '@/domain/nutricao'
import { mover } from '../opcoes'
import { tRefeicoes } from '../textos2'
import { tEditor as t } from '../textosRefeicao'
import { EditarAlimento } from './EditarAlimento'
import { NutrientesRefeicao } from './NutrientesRefeicao'
import { TabelaItens } from './TabelaItens'

type Props = { itens: Item[]; aoMudar: (itens: Item[]) => void }

/**
 * Alimentos selecionados da refeição, como no Dietbox: cada "Adicionar alimento" vira uma linha
 * nova que soma no total; o "ou" de um alimento fica em "Alimentos substitutos" ao editar a linha.
 */
export function ItensEditor({ itens, aoMudar }: Props) {
  const [editando, setEditando] = useState<number | 'novo' | null>(null)
  const [verNutrientes, setVerNutrientes] = useState(false)
  const salvar = (item: Item) =>
    aoMudar(
      editando === 'novo' || editando === null
        ? [...itens, item]
        : itens.map((it, k) => (k === editando ? item : it)),
    )
  return (
    <div className="flex flex-col gap-3">
      {itens.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#ECEFED] p-4 text-center text-[13px] text-suave">
          {tRefeicoes.semAlimentos}
        </p>
      ) : (
        <TabelaItens
          itens={itens}
          aoEditar={setEditando}
          aoExcluir={(i) => aoMudar(itens.filter((_, k) => k !== i))}
          aoMover={(de, para) => aoMudar(mover(itens, de, para))}
        />
      )}
      {verNutrientes && <NutrientesRefeicao n={totalItens(itens)} />}
      <div className="flex flex-wrap justify-end gap-2">
        <BotaoBrilho tom="cinza" onClick={() => setVerNutrientes((v) => !v)}>
          {verNutrientes ? t.ocultarNutrientes : t.verNutrientes}
        </BotaoBrilho>
        <BotaoBrilho tom="dourado" onClick={() => setEditando('novo')}>
          + {t.adicionarAlimento}
        </BotaoBrilho>
      </div>
      {editando !== null && (
        <EditarAlimento
          inicial={editando === 'novo' ? undefined : itens[editando]}
          aoSalvar={salvar}
          aoFechar={() => setEditando(null)}
        />
      )}
    </div>
  )
}
