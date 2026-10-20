import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BolinhaMenu as Bolinha, classeItemMenu as item, ItemMenuLateral } from '@/components/ui'
import { materiais } from '../plano/textosMateriais'
import { textos } from '../textos'

const a = textos.abas

type Item = { para: string; nome: string; cor: string }

/** Item do menu com bolinha de cor própria; a aula conta como Conteúdo. */
export function ItemMenu({ i, aoNavegar }: { i: Item; aoNavegar?: () => void }) {
  const emAula = useLocation().pathname.startsWith('/app/admin/aulas')
  return (
    <ItemMenuLateral
      para={i.para}
      nome={i.nome}
      cor={i.cor}
      aoNavegar={aoNavegar}
      ativo={emAula && i.para === 'conteudo' ? true : undefined}
    />
  )
}

const PLANO: Item[] = [
  { para: 'plano/cardapios', nome: a.cardapios, cor: '#F2643A' },
  { para: 'plano/refeicoes', nome: a.refeicoes, cor: '#F2A922' },
  { para: 'plano/receitas', nome: a.receitas, cor: '#7FB89E' },
  { para: 'plano/alimentos', nome: a.alimentos, cor: '#6E9BC9' },
  { para: 'plano/materiais', nome: materiais.menu, cor: '#D98BA8' },
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
