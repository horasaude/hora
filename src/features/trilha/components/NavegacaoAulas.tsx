import { Link } from 'react-router-dom'
import { IconeCadeado, IconeCheck, LinkBrilho } from '@/components/ui'
import type { AulaTrilha } from '@/domain/trilha'
import { useLinkAula } from '../previa'
import { textos } from '../textos'

/** Botão Próxima aula (só se a próxima já abriu). */
export function ProximaAula({ aulas, id }: { aulas: AulaTrilha[]; id: string }) {
  const linkAula = useLinkAula()
  const i = aulas.findIndex((a) => a.id === id)
  const proxima = i >= 0 ? aulas[i + 1] : undefined
  if (!proxima?.liberada) return null
  return (
    <LinkBrilho to={linkAula(proxima.id)} tom="cinza" className="self-start">
      {textos.aula.proxima}
    </LinkBrilho>
  )
}

/** Lista lateral das aulas da etapa (computador). */
export function NavegacaoAulas({ aulas, id }: { aulas: AulaTrilha[]; id: string }) {
  const linkAula = useLinkAula()
  if (aulas.length < 2) return null
  return (
    <nav aria-label={textos.aula.navegacao} className="hidden flex-col gap-1 lg:flex">
      <h2 className="mb-1 text-sm font-bold text-suave">{textos.aula.navegacao}</h2>
      {aulas.map((a) => {
        const atual = a.id === id
        const conteudo = (
          <>
            <span
              className={`w-11 shrink-0 text-[11px] font-bold uppercase ${atual ? 'text-white/85' : 'text-suave'}`}
            >
              {textos.diaN(a.dia_liberacao)}
            </span>
            <span className="min-w-0 flex-1 truncate">{a.titulo}</span>
            {a.concluida && <IconeCheck className="size-3.5 text-verde-vivo" />}
            {!a.liberada && <IconeCadeado className="size-3.5 text-suave" />}
          </>
        )
        const classe = `flex min-h-10 items-center gap-2 rounded-[12px] px-3 text-sm ${atual ? 'brilho brilho-verde font-bold' : a.liberada ? 'text-tinta hover:bg-trilho' : 'text-suave'}`
        return a.liberada && !atual ? (
          <Link key={a.id} to={linkAula(a.id)} className={classe}>
            {conteudo}
          </Link>
        ) : (
          <span key={a.id} className={classe} aria-current={atual ? 'page' : undefined}>
            {conteudo}
          </span>
        )
      })}
    </nav>
  )
}
