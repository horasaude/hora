import { Link } from 'react-router-dom'
import { BarraProgresso, Cartao, EtiquetaBrilho } from '@/components/ui'
import { progressoMeta } from '@/domain/engajamento'
import { diaMesDeData } from '@/lib/datas'
import type { Desafio } from '../api/desafios.api'
import { useRankingDesafio } from '../hooks/useDesafios'
import { textos } from '../textos'

const t = textos.encerrado

/** Desafio que ela fez: quanto completou e as vencedoras. */
export function CartaoEncerrado({ d }: { d: Desafio }) {
  const ranking = useRankingDesafio(d.id)
  const vencedoras = (ranking.data ?? []).filter((l) => l.dias >= d.meta_dias)
  const venceu = d.dias_feitos >= d.meta_dias
  return (
    <Link
      to={`/app/desafios/${d.id}`}
      className="block rounded-[22px] focus-visible:outline-2 focus-visible:outline-ora"
    >
      <Cartao className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[17px] leading-snug font-bold text-tinta">{d.nome}</h2>
          {venceu && <EtiquetaBrilho tom="dourado">{t.voce}</EtiquetaBrilho>}
        </div>
        <p className="text-sm text-suave">
          {textos.periodo(diaMesDeData(d.inicio), diaMesDeData(d.fim))}
        </p>
        <BarraProgresso
          pct={progressoMeta(d.dias_feitos, d.meta_dias)}
          legenda={t.completou(d.dias_feitos, d.meta_dias)}
        />
        <p className="text-sm text-tinta">
          <span className="font-bold text-ocre">{t.vencedoras}: </span>
          {ranking.isPending
            ? ''
            : vencedoras.length
              ? vencedoras.map((v) => v.apelido).join(', ')
              : t.ninguem}
        </p>
      </Cartao>
    </Link>
  )
}
