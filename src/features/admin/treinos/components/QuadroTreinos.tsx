import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Quadro } from '../../components/Quadro'
import { useResumoTreinos } from '../hooks/useTreinosPainel'
import { t } from '../textos'

const ABAS = [
  { para: '/app/admin/treinos', nome: t.abas.treinos, fim: true },
  { para: '/app/admin/treinos/exercicios', nome: t.abas.exercicios },
  { para: '/app/admin/treinos/modelos', nome: t.abas.modelos },
  { para: '/app/admin/treinos/publicados', nome: t.abas.publicados },
]

/** Moldura das telas de Treinos: título, botão principal, KPIs e as pílulas das quatro telas. */
export function QuadroTreinos({ acao, children }: { acao?: ReactNode; children: ReactNode }) {
  const r = useResumoTreinos().data
  const n = (v: number | undefined) => (v === undefined ? '-' : String(v))
  return (
    <Quadro
      titulo={t.titulo}
      acao={acao}
      numeros={[
        { valor: n(r?.publicados), rotulo: t.kpis.publicados, tom: 'salvia' },
        { valor: n(r?.exercicios), rotulo: t.kpis.exercicios, tom: 'ocre' },
        { valor: n(r?.feitos_7_dias), rotulo: t.kpis.feitos, tom: 'terracota' },
      ]}
    >
      <nav aria-label={t.titulo} className="flex flex-wrap gap-2">
        {ABAS.map((a) => (
          <NavLink
            key={a.para}
            to={a.para}
            end={a.fim}
            className={({ isActive }) =>
              `brilho ${isActive ? 'brilho-verde' : 'brilho-cinza'} inline-flex min-h-9 items-center rounded-full px-4 text-[13px] font-bold`
            }
          >
            {a.nome}
          </NavLink>
        ))}
      </nav>
      {children}
    </Quadro>
  )
}
