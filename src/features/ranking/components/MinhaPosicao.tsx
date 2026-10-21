import { faltaParaSubir, type LinhaRanking } from '@/domain/engajamento'
import { textos } from '../textos'

const t = textos.minha

/** Linha curta acima da lista: quanto falta para subir uma posição (e o aviso de quem não aparece). */
export function MinhaPosicao({ linhas, oculta }: { linhas: LinhaRanking[]; oculta: boolean }) {
  const eu = linhas.find((l) => l.eu)
  if (!eu) return null
  const falta = faltaParaSubir(linhas)
  return (
    <div className="flex flex-col gap-0.5 text-center">
      <p className="text-[13px] font-bold text-terracota-escuro">
        {textos.posicaoDe(eu.posicao)} · {falta === null ? t.topo : t.falta(falta)}
      </p>
      {oculta && <p className="text-[12px] text-suave">{t.oculta}</p>}
    </div>
  )
}
