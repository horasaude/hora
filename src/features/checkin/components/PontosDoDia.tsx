import { Link } from 'react-router-dom'
import { Cartao, IconeCheck } from '@/components/ui'
import type { AcaoDePontos } from '../api/checkin.api'
import { usePontosDoDia } from '../hooks/useCheckin'
import { textos } from '../textos'

const t = textos.pontosDia

function Situacao({ a }: { a: AcaoDePontos }) {
  if (a.limite_tipo === 'por_dia' && a.limite_qtd) {
    if (a.feitas_hoje >= a.limite_qtd)
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-verde-escuro">
          <IconeCheck className="size-3" />
          {t.feito}
        </span>
      )
    if (a.limite_qtd > 1)
      return <span className="text-xs text-suave">{t.deN(a.feitas_hoje, a.limite_qtd)}</span>
  }
  if (a.feitas_hoje > 0)
    return <span className="text-xs font-bold text-verde-escuro">{t.vezes(a.feitas_hoje)}</span>
  return <span className="text-xs text-suave">{t.falta}</span>
}

function Linha({ a }: { a: AcaoDePontos }) {
  const como = textos.comoGanhar[a.acao]
  const feito =
    a.limite_tipo === 'por_dia' && a.limite_qtd !== null && a.feitas_hoje >= a.limite_qtd
  return (
    <li
      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${feito ? 'bg-[#EAF5EE]' : 'bg-trilho'}`}
    >
      <span className="brilho brilho-dourado grid min-w-14 shrink-0 place-items-center rounded-full px-2 py-1 text-xs font-bold">
        {t.cada(a.pontos)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-tinta">{a.nome}</span>
        <span className="block text-xs text-suave">
          {a.propria ? t.equipe : (como?.texto ?? '')}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <Situacao a={a} />
        {como?.para && !feito && (
          <Link to={como.para} className="text-xs font-bold text-ora underline">
            {t.ir}
          </Link>
        )}
      </span>
    </li>
  )
}

/** Tudo que dá ponto no ORA, quanto vale e o que ela já fez hoje (as regras vêm do painel). */
export function PontosDoDia() {
  const q = usePontosDoDia()
  const lista = (q.data ?? []).filter((a) => !textos.semUso.includes(a.acao))
  if (lista.length === 0) return null
  const hoje = lista.reduce((s, a) => s + a.pontos_hoje, 0)
  return (
    <Cartao className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-tinta">{t.titulo}</h2>
        <span className="brilho brilho-verde inline-flex min-h-7 items-center rounded-full px-3 text-xs font-bold">
          {t.total(hoje)}
        </span>
      </div>
      <ul className="grid gap-2 lg:grid-cols-2">
        {lista.map((a) => (
          <Linha key={a.acao} a={a} />
        ))}
      </ul>
    </Cartao>
  )
}
