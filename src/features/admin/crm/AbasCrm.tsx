import { NavLink } from 'react-router-dom'
import { t } from './textos'

const ABAS = [
  { para: '/app/admin/membros', nome: t.abas.painel },
  { para: '/app/admin/alunas', nome: t.abas.alunas },
  { para: '/app/admin/financeiro', nome: t.abas.financeiro },
  { para: '/app/admin/cancelamentos', nome: t.abas.cancelamentos },
]

/** Pílulas do CRM (Membros): Painel, Alunas, Financeiro e Cancelamentos. */
export function AbasCrm() {
  return (
    <nav aria-label={t.titulo} className="flex flex-wrap gap-2">
      {ABAS.map((a) => (
        <NavLink
          key={a.para}
          to={a.para}
          end
          className={({ isActive }) =>
            `brilho ${isActive ? 'brilho-verde' : 'brilho-cinza'} inline-flex min-h-9 items-center rounded-full px-4 text-[13px] font-bold`
          }
        >
          {a.nome}
        </NavLink>
      ))}
    </nav>
  )
}
