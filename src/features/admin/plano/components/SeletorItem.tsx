import type { Seletor } from '../hooks/useSeletor'
import { tEscolher as t } from '../textos2'
import { CampoBusca } from './Ferramentas'
import { Ajuste } from './AjusteItem'
import { Resultados, type Fonte } from './Resultados'

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

/** Abas, busca e lista à esquerda; medida caseira e quantidade à direita. */
export function PainelSeletor({ s }: { s: Seletor }) {
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-3">
        <AbasFonte fontes={s.fontes} fonte={s.fonte} aoMudar={s.setFonte} />
        <CampoBusca valor={s.busca} aoMudar={s.setBusca} />
        <Resultados
          fonte={s.fonte}
          busca={s.busca}
          escolhido={s.escolhido}
          aoEscolher={s.escolher}
        />
      </div>
      {s.escolhido ? (
        <Ajuste
          e={s.escolhido}
          medida={s.medida}
          setMedida={s.setMedida}
          qtd={s.qtd}
          setQtd={s.setQtd}
        />
      ) : (
        <p className="text-[13px] text-suave">{t.escolher}</p>
      )}
    </div>
  )
}
