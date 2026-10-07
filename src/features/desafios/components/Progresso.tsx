import { BarraProgresso } from '@/components/ui'
import { diaDoDesafio, diasEntre, progressoMeta } from '@/domain/engajamento'
import type { Desafio } from '../api/desafios.api'
import { textos } from '../textos'

/** Barra dourada com "Dia X de N · faltam Y para o prêmio". */
export function ProgressoDesafio({ d, hoje }: { d: Desafio; hoje: string }) {
  const total = diasEntre(d.inicio, d.fim) + 1
  const falta = Math.max(0, d.meta_dias - d.dias_feitos)
  return (
    <BarraProgresso
      pct={progressoMeta(d.dias_feitos, d.meta_dias)}
      rotulo={textos.progressoRotulo}
      legenda={textos.progresso(diaDoDesafio(d.inicio, d.fim, hoje), total, falta)}
    />
  )
}
