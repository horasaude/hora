import { useState } from 'react'
import { BotaoBrilho, Janela } from '@/components/ui'
import type { Opcao, Por100 } from '@/domain/nutricao'
import { por100De, type MedidaEscolhida } from '../opcoes'
import { textos } from '../textos'
import { tEscolher as t } from '../textos2'
import { CampoBusca } from './Ferramentas'
import { montar } from '../opcoes'
import { Ajuste } from './AjusteItem'
import { Resultados, type Escolhido, type Fonte } from './Resultados'

type Props = {
  titulo: string
  soAlimentos?: boolean
  aoEscolher: (o: Opcao, por100?: Por100) => void
  aoFechar: () => void
}

/** Abas de onde buscar: Todas, TACO, Meus alimentos e Receitas. */
function AbasFonte({
  fontes,
  fonte,
  aoMudar,
}: {
  fontes: readonly Fonte[]
  fonte: Fonte
  aoMudar: (f: Fonte) => void
}) {
  return (
    <div role="tablist" className="flex flex-wrap gap-1.5">
      {fontes.map((f) => (
        <button
          key={f}
          type="button"
          role="tab"
          aria-selected={fonte === f}
          onClick={() => aoMudar(f)}
          className={`min-h-8 rounded-full px-3 text-xs font-bold ${fonte === f ? 'brilho brilho-verde' : 'border border-[#ECEFED] bg-white text-suave'}`}
        >
          {t.fontes[f]}
        </button>
      ))}
    </div>
  )
}

/** Janela de adicionar alimento: busca (Todas, TACO, Meus alimentos, Receitas), medida e quantidade. */
export function EscolherItem({ titulo, soAlimentos, aoEscolher, aoFechar }: Props) {
  const [fonte, setFonte] = useState<Fonte>('todas')
  const [busca, setBusca] = useState('')
  const [escolhido, setEscolhido] = useState<Escolhido>()
  const [medida, setMedida] = useState<MedidaEscolhida>(null)
  const [qtd, setQtd] = useState('100')
  const quantidade = Number(qtd.replace(',', '.'))
  const fontes = soAlimentos
    ? (['todas', 'taco', 'proprio'] as const)
    : (['todas', 'taco', 'proprio', 'receitas'] as const)
  const escolher = (e: Escolhido) => (
    setEscolhido(e),
    setMedida(null),
    setQtd(e.tipo === 'receita' ? '1' : '100')
  )
  const confirmar = () => {
    if (!escolhido || !(quantidade > 0)) return
    aoEscolher(
      montar(escolhido, medida, quantidade),
      escolhido.tipo === 'alimento' ? por100De(escolhido.a) : undefined,
    )
    aoFechar()
  }
  return (
    <Janela
      larga
      titulo={titulo}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {textos.cancelar}
          </BotaoBrilho>
          <BotaoBrilho disabled={!escolhido || !(quantidade > 0)} onClick={confirmar}>
            {t.adicionar}
          </BotaoBrilho>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-3">
          <AbasFonte fontes={fontes} fonte={fonte} aoMudar={setFonte} />
          <CampoBusca valor={busca} aoMudar={setBusca} />
          <Resultados
            fonte={soAlimentos && fonte === 'receitas' ? 'todas' : fonte}
            busca={busca}
            escolhido={escolhido}
            aoEscolher={escolher}
          />
        </div>
        {escolhido ? (
          <Ajuste e={escolhido} medida={medida} setMedida={setMedida} qtd={qtd} setQtd={setQtd} />
        ) : (
          <p className="text-[13px] text-suave">{t.escolher}</p>
        )}
      </div>
    </Janela>
  )
}
