import { Link } from 'react-router-dom'
import { Cartao, EtiquetaBrilho } from '@/components/ui'
import { CATEGORIAS, ehCategoria } from '@/domain/forum'
import { formatarData } from '@/lib/datas'
import type { Duvida } from '../api/forum.api'
import { textos as t } from '../textos'
import { Denunciar } from './Denunciar'
import { Resposta } from './Resposta'

const categoria = (c: string) => (ehCategoria(c) ? CATEGORIAS[c] : c)

/** Apelido, categoria, aula de origem e data. */
export function CabecalhoDuvida({ d, linkAula }: { d: Duvida; linkAula?: string }) {
  const aula = d.aula_titulo ?? t.geral
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-suave">
      <span className="font-bold text-tinta">{d.autora}</span>
      <EtiquetaBrilho tom="cinza">{categoria(d.categoria)}</EtiquetaBrilho>
      {linkAula && d.aula_id ? (
        <Link to={linkAula} className="underline underline-offset-4 hover:text-tinta">
          {aula}
        </Link>
      ) : (
        <span>{aula}</span>
      )}
      <span aria-hidden>·</span>
      <span>{formatarData(new Date(d.created_at))}</span>
    </div>
  )
}

/** Cartão da lista do fórum: abre a conversa. */
export function CartaoDuvida({ d }: { d: Duvida }) {
  return (
    <Link to={`/app/forum/${d.id}`} aria-label={t.abrir(d.texto.slice(0, 60))}>
      <Cartao className="flex h-full flex-col gap-3 transition hover:shadow-menu">
        <CabecalhoDuvida d={d} />
        <p className="line-clamp-3 text-[15px] leading-relaxed text-tinta">{d.texto}</p>
        <div className="mt-auto flex items-center justify-between gap-2 text-[13px]">
          <span className="text-suave">{t.respostas(d.total_respostas)}</span>
          {d.respondida_em && <EtiquetaBrilho tom="verde">{t.respondida}</EtiquetaBrilho>}
        </div>
      </Cartao>
    </Link>
  )
}

/** Dúvida com a conversa inteira; as respostas das profissionais vêm primeiro. */
export function Conversa({
  d,
  painel = false,
  linkAula,
}: {
  d: Duvida
  painel?: boolean
  linkAula?: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <CabecalhoDuvida d={d} linkAula={linkAula} />
      <p className="text-[17px] leading-relaxed whitespace-pre-line text-tinta">{d.texto}</p>
      <div className="flex items-center gap-4 text-[13px] text-suave">
        <span>{t.respostas(d.total_respostas)}</span>
        {!d.respondida_em && <span>{t.aguardando}</span>}
        {!painel && !d.minha && <Denunciar topico={d.id} />}
      </div>
      {d.respostas.length > 0 && (
        <ul className="flex flex-col gap-3">
          {d.respostas.map((r) => (
            <Resposta key={r.id} r={r} util={d.util} painel={painel} />
          ))}
        </ul>
      )}
    </div>
  )
}
