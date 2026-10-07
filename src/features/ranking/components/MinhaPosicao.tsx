import { Cartao } from '@/components/ui'
import { faltaParaSubir, type LinhaRanking } from '@/domain/engajamento'
import type { Periodo } from '../api/ranking.api'
import { textos } from '../textos'

const t = textos.minha

/** Cartão do topo: posição dela, pontos do período e quanto falta para subir uma posição. */
export function MinhaPosicao({
  linhas,
  periodo,
  oculta,
}: {
  linhas: LinhaRanking[]
  periodo: Periodo
  oculta: boolean
}) {
  const eu = linhas.find((l) => l.eu)
  if (!eu) return null
  const falta = faltaParaSubir(linhas)
  return (
    <Cartao className="grid gap-4 sm:grid-cols-[auto_auto_1fr] sm:items-end sm:gap-14">
      <div>
        <p className="text-sm text-suave">{t.titulo[periodo]}</p>
        <p className="text-[40px] leading-tight font-bold text-verde-escuro">
          {textos.posicaoDe(eu.posicao)}
        </p>
      </div>
      <div>
        <p className="text-[32px] leading-tight font-bold text-verde-escuro">
          {eu.pontos.toLocaleString('pt-BR')}
        </p>
        <p className="text-sm text-suave">{periodo === 'mes' ? t.pontosMes : t.pontosAno}</p>
      </div>
      <div className="flex flex-col gap-1 sm:pb-1">
        <p className="text-sm font-bold text-terracota-escuro">
          {falta === null ? t.topo : t.falta(falta)}
        </p>
        {oculta && <p className="text-[13px] text-suave">{t.oculta}</p>}
      </div>
    </Cartao>
  )
}
