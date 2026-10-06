import { Link, NavLink, useLocation } from 'react-router-dom'
import { LogoHora } from '@/components/ui'
import { useNome } from '@/features/auth'
import { textos } from '../textos'

const AZUL = 'bg-[#7d9cbf]'
const ROSA = 'bg-[#d98b8b]'
const a = textos.abas
const ITENS = [
  { para: 'conteudo', nome: a.conteudo, cor: 'bg-ocre' },
  { para: 'cardapios', nome: a.cardapios, cor: 'bg-terracota' },
  { para: 'lives', nome: a.lives, cor: 'bg-salvia' },
  { para: 'desafios', nome: a.desafios, cor: 'bg-ocre' },
  { para: 'pontos', nome: a.pontos, cor: AZUL },
  { para: 'forum', nome: a.forum, cor: ROSA },
  { para: 'avisos', nome: a.avisos, cor: 'bg-salvia' },
  { para: 'alunas', nome: a.alunas, cor: 'bg-ocre' },
  { para: 'financeiro', nome: a.financeiro, cor: AZUL },
  { para: 'loja', nome: a.loja, cor: ROSA },
  { para: 'configuracoes', nome: a.configuracoes, cor: 'bg-salvia' },
] as const

/** Menu lateral branco: logo, itens com bolinha colorida (o aberto em vidro verde) e quem está logada. */
export function MenuLateral({ aoNavegar }: { aoNavegar?: () => void }) {
  const nome = useNome()
  // Aula é parte do Conteúdo, mesmo com endereço próprio.
  const emAula = useLocation().pathname.startsWith('/app/admin/aulas')
  return (
    <div className="flex h-full flex-col px-4 py-8">
      <LogoHora largura={130} className="mx-2 mt-1 mb-2" />
      <nav className="mt-6 min-h-0 flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {ITENS.map((i) => (
            <li key={i.para}>
              <NavLink
                to={i.para}
                onClick={aoNavegar}
                className={({ isActive: ativo }) => {
                  const isActive = ativo || (emAula && i.para === 'conteudo')
                  return `flex min-h-11 items-center gap-3 rounded-2xl px-3.5 text-[0.95rem] transition ${isActive ? 'brilho brilho-verde font-bold' : 'text-tinta hover:bg-trilho'}`
                }}
              >
                {({ isActive }) => (
                  <>
                    {!(isActive || (emAula && i.para === 'conteudo')) && (
                      <span className={`size-2 shrink-0 rounded-full ${i.cor}`} aria-hidden />
                    )}
                    {i.nome}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-4 flex flex-col gap-2 px-3">
        <span className="text-xs text-suave">{textos.logadaComo}</span>
        <span className="rounded-xl bg-trilho px-3 py-2 text-sm text-tinta">
          {nome.data ?? '...'}
        </span>
        <Link
          to="/app"
          className="mt-2 inline-flex min-h-11 items-center text-xs text-suave underline underline-offset-4"
        >
          {textos.sair}
        </Link>
      </div>
    </div>
  )
}
