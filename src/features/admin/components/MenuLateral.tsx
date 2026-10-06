import { Link, NavLink, useLocation } from 'react-router-dom'
import { useNome } from '@/features/auth'
import { textos } from '../textos'

const ITENS = [
  { para: 'conteudo', nome: textos.abas.conteudo, cor: 'bg-ocre' },
  { para: 'lives', nome: textos.abas.lives, cor: 'bg-terracota' },
  { para: 'avisos', nome: textos.abas.avisos, cor: 'bg-salvia' },
] as const

/** Barra lateral verde: marca, itens com bolinha colorida e quem está logada. */
export function MenuLateral({ aoNavegar }: { aoNavegar?: () => void }) {
  const nome = useNome()
  // Aula é parte do Conteúdo, mesmo com endereço próprio.
  const emAula = useLocation().pathname.startsWith('/app/admin/aulas')
  return (
    <div className="flex h-full flex-col px-4 py-8">
      <span className="px-3 font-titulo text-3xl font-bold tracking-wide text-ocre">
        {textos.marca}
      </span>
      <nav className="mt-8">
        <ul className="flex flex-col gap-1">
          {ITENS.map((i) => (
            <li key={i.para}>
              <NavLink
                to={i.para}
                onClick={aoNavegar}
                className={({ isActive: ativo }) => {
                  const isActive = ativo || (emAula && i.para === 'conteudo')
                  return `flex min-h-12 items-center gap-3 rounded-xl px-3 text-[0.95rem] text-white transition ${isActive ? 'bg-white/12 font-semibold' : 'hover:bg-white/6'}`
                }}
              >
                <span className={`size-2 rounded-full ${i.cor}`} aria-hidden />
                {i.nome}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto flex flex-col gap-2 px-3">
        <span className="text-xs text-white/60">{textos.logadaComo}</span>
        <span className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white">
          {nome.data ?? '...'}
        </span>
        <Link
          to="/app"
          className="mt-2 inline-flex min-h-11 items-center text-xs text-white/70 underline underline-offset-4"
        >
          {textos.sair}
        </Link>
      </div>
    </div>
  )
}
