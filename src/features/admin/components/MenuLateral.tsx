import { Link } from 'react-router-dom'
import { LogoOra } from '@/components/ui'
import { useMeuPerfil, useNome, useSair } from '@/features/auth'
import { textos } from '../textos'
import { saude } from '../textos/saude'
import { GrupoMenu, ItemMenu } from './MenuItens'
import { t as textosCancelamentos } from '../cancelamentos/textos'

const a = textos.abas
// Bolinhas com as cores da referência do painel (docs/referencias/estilo-painel.html).
const ITENS = [
  { para: 'conteudo', nome: a.conteudo, cor: '#F2A922' },
  { para: 'plano', nome: a.plano, cor: '#F2643A' },
  { para: 'treinos', nome: a.treinos, cor: '#F2643A' },
  { para: 'saude', nome: saude.menu, cor: '#7FB89E' },
  { para: 'lives', nome: a.lives, cor: '#7FB89E' },
  { para: 'desafios', nome: a.desafios, cor: '#F2A922' },
  { para: 'pontos', nome: a.pontos, cor: '#6E9BC9' },
  { para: 'forum', nome: a.forum, cor: '#D98BA8' },
  { para: 'avisos', nome: a.avisos, cor: '#7FB89E' },
  { para: 'alunas', nome: a.alunas, cor: '#F2643A' },
  { para: 'cancelamentos', nome: textosCancelamentos.titulo, cor: '#C9746E' },
  { para: 'financeiro', nome: a.financeiro, cor: '#6E9BC9' },
  { para: 'loja', nome: a.loja, cor: '#D98BA8' },
  { para: 'configuracoes', nome: a.configuracoes, cor: '#B9C3BF' },
] as const

/** Menu lateral verde escuro: logo clara, itens com bolinha de cor própria, os grupos Plano alimentar e Saúde, quem está logada e sair da conta. */
export function MenuLateral({ aoNavegar }: { aoNavegar?: () => void }) {
  const nome = useNome()
  const sair = useSair()
  const dev = useMeuPerfil().data?.desenvolvedora
  return (
    <div className="flex h-full flex-col px-3.5 py-6">
      <LogoOra clara largura={118} className="mx-2.5 mb-2" />
      <nav className="mt-6 min-h-0 flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {ITENS.map((i) =>
            i.para === 'plano' || i.para === 'saude' ? (
              <GrupoMenu key={i.para} qual={i.para} aoNavegar={aoNavegar} />
            ) : (
              <ItemMenu key={i.para} i={i} aoNavegar={aoNavegar} />
            ),
          )}
        </ul>
      </nav>
      <div className="mt-3 flex shrink-0 flex-col gap-2 border-t border-white/10 px-3 pt-4">
        <span className="text-xs text-white/60">{textos.logadaComo}</span>
        <span className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white">
          {nome.data ?? '...'}
        </span>
        {dev && (
          <Link
            to="/app"
            className="mt-2 inline-flex min-h-11 items-center text-sm text-white/80 underline underline-offset-4"
          >
            {textos.temas.verComoAluna}
          </Link>
        )}
        <button
          type="button"
          onClick={() => sair.mutate()}
          disabled={sair.isPending}
          className="mt-2 inline-flex min-h-11 items-center self-start text-sm text-white/80 underline underline-offset-4"
        >
          {sair.isPending ? textos.saindo : textos.sair}
        </button>
      </div>
    </div>
  )
}
