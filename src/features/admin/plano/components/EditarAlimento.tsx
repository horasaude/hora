import { useId, useState } from 'react'
import { BotaoBrilho, Campo, Janela } from '@/components/ui'
import type { Item, Opcao } from '@/domain/nutricao'
import type { AlimentoComMedidas } from '../api/alimentos.api'
import { comQuantidade, opcaoDeAlimento, rotuloOpcao, type MedidaEscolhida } from '../opcoes'
import { textos } from '../textos'
import { tEscolher } from '../textos2'
import { tEditor as t } from '../textosRefeicao'
import { useAlimentoDaLinha } from '../hooks/useAlimentoDaLinha'
import { useSeletor } from '../hooks/useSeletor'
import { Ajuste } from './AjusteItem'
import { PainelSeletor } from './SeletorItem'
import { SubstitutosEditor } from './SubstitutosEditor'

type Fixo = {
  o: Opcao
  a?: AlimentoComMedidas
  medida: MedidaEscolhida
  setMedida: (m: MedidaEscolhida) => void
  qtd: string
  setQtd: (q: string) => void
  aoTrocar: () => void
}

/** Alimento já escolhido (ao editar a linha): troca a medida caseira e a quantidade, ou troca o alimento. */
function AlimentoFixo({ o, a, medida, setMedida, qtd, setQtd, aoTrocar }: Fixo) {
  const id = useId()
  if (a)
    return (
      <div className="flex flex-col gap-2">
        <Ajuste
          e={{ tipo: 'alimento', a }}
          medida={medida}
          setMedida={setMedida}
          qtd={qtd}
          setQtd={setQtd}
        />
        <button
          type="button"
          onClick={aoTrocar}
          className="min-h-8 self-start text-xs font-bold text-verde-escuro underline underline-offset-4"
        >
          {t.trocarAlimento}
        </button>
      </div>
    )
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

/** Medida guardada na linha ("g" = gramas). */
const medidaDe = (o?: Opcao): MedidaEscolhida =>
  o && o.medida !== 'g' ? { nome: o.medida, gramas: o.gramas_medida } : null

type Props = { inicial?: Item; aoSalvar: (item: Item) => void; aoFechar: () => void }

/** Janela "Editar alimento": o alimento da linha (busca, medida e quantidade) e os substitutos "ou". */
export function EditarAlimento({ inicial, aoSalvar, aoFechar }: Props) {
  const s = useSeletor()
  const [fixo, setFixo] = useState<Opcao | undefined>(inicial?.opcoes[0])
  const [qtd, setQtd] = useState(String(inicial?.opcoes[0]?.quantidade ?? ''))
  const [subs, setSubs] = useState<Opcao[]>(inicial?.opcoes.slice(1) ?? [])
  const [medida, setMedida] = useState<MedidaEscolhida>(medidaDe(inicial?.opcoes[0]))
  const alimento = useAlimentoDaLinha(fixo?.tipo === 'alimento' ? fixo.ref_id : null).data
  const quantidade = Number(qtd.replace(',', '.'))
  const principal = !fixo
    ? s.opcao
    : quantidade <= 0
      ? undefined
      : alimento
        ? opcaoDeAlimento(alimento, medida, quantidade)
        : comQuantidade(fixo, quantidade)
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
          <AlimentoFixo
            o={fixo}
            a={alimento}
            medida={medida}
            setMedida={setMedida}
            qtd={qtd}
            setQtd={setQtd}
            aoTrocar={() => setFixo(undefined)}
          />
        ) : (
          <PainelSeletor s={s} />
        )}
        <SubstitutosEditor subs={subs} aoMudar={setSubs} />
      </div>
    </Janela>
  )
}
