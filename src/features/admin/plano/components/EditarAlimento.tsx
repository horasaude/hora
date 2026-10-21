import { useId, useState } from 'react'
import { BotaoBrilho, Campo, Janela } from '@/components/ui'
import type { Item, Opcao } from '@/domain/nutricao'
import { comQuantidade, rotuloOpcao } from '../opcoes'
import { textos } from '../textos'
import { tEscolher } from '../textos2'
import { tEditor as t } from '../textosRefeicao'
import { useSeletor } from '../hooks/useSeletor'
import { PainelSeletor } from './SeletorItem'
import { SubstitutosEditor } from './SubstitutosEditor'

/** Alimento já escolhido (ao editar a linha): muda a quantidade ou troca o alimento. */
function AlimentoFixo({
  o,
  qtd,
  setQtd,
  aoTrocar,
}: {
  o: Opcao
  qtd: string
  setQtd: (q: string) => void
  aoTrocar: () => void
}) {
  const id = useId()
  return (
    <div className="grid gap-4 rounded-xl bg-[#F8FAF9] p-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-end">
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-bold text-verde-escuro">{o.nome}</p>
        <p className="text-[13px] text-[#40504B]">
          {rotuloOpcao(o)} · <b>{t.kcal(o.nutrientes.kcal)}</b>
        </p>
        <button
          type="button"
          onClick={aoTrocar}
          className="mt-1 min-h-8 self-start text-xs font-bold text-verde-escuro underline underline-offset-4"
        >
          {t.trocarAlimento}
        </button>
      </div>
      <Campo
        id={id}
        rotulo={o.tipo === 'receita' ? `${t.quantidade} (${tEscolher.porcao})` : t.quantidade}
        inputMode="decimal"
        value={qtd}
        onChange={(e) => setQtd(e.target.value)}
      />
    </div>
  )
}

type Props = { inicial?: Item; aoSalvar: (item: Item) => void; aoFechar: () => void }

/** Janela "Editar alimento": o alimento da linha (busca, medida e quantidade) e os substitutos "ou". */
export function EditarAlimento({ inicial, aoSalvar, aoFechar }: Props) {
  const s = useSeletor()
  const [fixo, setFixo] = useState<Opcao | undefined>(inicial?.opcoes[0])
  const [qtd, setQtd] = useState(String(inicial?.opcoes[0]?.quantidade ?? ''))
  const [subs, setSubs] = useState<Opcao[]>(inicial?.opcoes.slice(1) ?? [])
  const quantidade = Number(qtd.replace(',', '.'))
  const principal = fixo ? (quantidade > 0 ? comQuantidade(fixo, quantidade) : undefined) : s.opcao
  const salvar = () => {
    if (!principal) return
    aoSalvar({ opcoes: [principal, ...subs] })
    aoFechar()
  }
  return (
    <Janela
      larga
      titulo={inicial ? t.editarAlimento : t.adicionarAlimento}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {textos.cancelar}
          </BotaoBrilho>
          <BotaoBrilho disabled={!principal} onClick={salvar}>
            {t.salvar}
          </BotaoBrilho>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {fixo ? (
          <AlimentoFixo o={fixo} qtd={qtd} setQtd={setQtd} aoTrocar={() => setFixo(undefined)} />
        ) : (
          <PainelSeletor s={s} />
        )}
        <SubstitutosEditor subs={subs} aoMudar={setSubs} />
      </div>
    </Janela>
  )
}
