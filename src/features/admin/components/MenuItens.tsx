import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { textos } from '../textos'

const a = textos.abas
const item = (ativo: boolean) =>
  `flex min-h-10 items-center gap-2.5 rounded-xl px-3 text-sm text-[#E9EFEC] transition ${ativo ? 'bg-white/12 font-bold' : 'hover:bg-white/6'}`

function Bolinha({ cor }: { cor: string }) {
  return (
    <span
      className="size-2 shrink-0 rounded-full shadow-[inset_0_1px_1px_rgb(255_255_255/0.6)]"
      style={{ background: cor }}
      aria-hidden
    />
  )
}

type Item = { para: string; nome: string; cor: string }

/** Item do menu com bolinha de cor própria; a aula conta como Conteúdo. */
export function ItemMenu({ i, aoNavegar }: { i: Item; aoNavegar?: () => void }) {
  const emAula = useLocation().pathname.startsWith('/app/admin/aulas')
  return (
    <li>
      <NavLink
        to={i.para}
        onClick={aoNavegar}
        className={({ isActive }) => item(isActive || (emAula && i.para === 'conteudo'))}
      >
        <Bolinha cor={i.cor} />
        {i.nome}
      </NavLink>
    </li>
  )
}

const PLANO: Item[] = [
  { para: 'plano/cardapios', nome: a.cardapios, cor: '#F2643A' },
  { para: 'plano/refeicoes', nome: a.refeicoes, cor: '#F2A922' },
  { para: 'plano/receitas', nome: a.receitas, cor: '#7FB89E' },
  { para: 'plano/alimentos', nome: a.alimentos, cor: '#6E9BC9' },
]

/** Grupo "Plano alimentar" que abre e fecha; fica aberto quando uma das telas dele está aberta. */
export function GrupoPlano({ aoNavegar }: { aoNavegar?: () => void }) {
  const dentro = useLocation().pathname.startsWith('/app/admin/plano')
  const [aberto, setAberto] = useState(dentro)
  const visivel = aberto || dentro
  return (
    <li>
      <button
        type="button"
        aria-expanded={visivel}
        onClick={() => setAberto(!visivel)}
        className={`${item(false)} w-full`}
      >
        <Bolinha cor="#F2643A" />
        <span className="flex-1 text-left">{a.plano}</span>
        <svg
          viewBox="0 0 16 16"
          aria-hidden
          className={`size-3.5 transition ${visivel ? 'rotate-180' : ''}`}
        >
          <path
            d="m4 6 4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {visivel && (
        <ul className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-white/10 pl-2">
          {PLANO.map((p) => (
            <ItemMenu key={p.para} i={p} aoNavegar={aoNavegar} />
          ))}
        </ul>
      )}
    </li>
  )
}
