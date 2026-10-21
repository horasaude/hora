import { Link } from 'react-router-dom'
import { EtiquetaBrilho, type TomBrilho } from '@/components/ui'
import { CATEGORIAS, ehCategoria } from '@/domain/forum'
import { formatarData } from '@/lib/datas'
import type { Duvida, RespostaForum } from '../api/forum.api'
import { textos as t } from '../textos'
import { IconeConversa, IconeCoracao } from './IconesForum'
import { Avatar } from './Resposta'

/** Cor da etiqueta de cada categoria. */
const TOM: Record<string, TomBrilho> = {
  alimentacao: 'coral',
  treino: 'dourado',
  saude: 'lilas',
  plataforma: 'verde',
  outros: 'cinza',
}

/** Resposta da profissional num quadro claro: foto, nome, função e o começo do texto. */
function RespostaDestaque({ r }: { r: RespostaForum }) {
  return (
    <div className="flex gap-2.5 rounded-[14px] bg-creme p-3 text-[13px] leading-snug">
      <Avatar nome={r.autora} foto={r.foto} pequeno />
      <p className="min-w-0 text-tinta">
        <b>{r.autora}</b>
        {r.titulo && <span className="text-suave"> · {r.titulo}</span>}
        <span className="mt-0.5 line-clamp-3 block">{r.texto}</span>
      </p>
    </div>
  )
}

/** Cartão da lista do fórum: categoria, pergunta, resposta da profissional e curtidas. Abre a conversa. */
export function CartaoDuvida({ d }: { d: Duvida }) {
  const equipe = d.respostas.find((r) => r.da_equipe && !r.oculto)
  const curtidas = d.respostas.reduce((soma, r) => soma + r.curtidas, 0)
  const cat = ehCategoria(d.categoria) ? d.categoria : 'outros'
  return (
    <Link
      to={`/app/forum/${d.id}`}
      aria-label={t.abrir(d.texto.slice(0, 60))}
      className="flex h-full flex-col gap-2.5 rounded-[18px] border border-linha bg-white p-4 transition hover:shadow-menu"
    >
      <span className="self-start">
        <EtiquetaBrilho tom={TOM[cat] ?? 'cinza'}>{CATEGORIAS[cat]}</EtiquetaBrilho>
      </span>
      <b className="line-clamp-3 text-[15px] leading-snug text-tinta">{d.texto}</b>
      {equipe ? (
        <RespostaDestaque r={equipe} />
      ) : (
        <p className="text-[13px] text-suave">{t.aguardando}</p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-suave">
        <span className="inline-flex items-center gap-1">
          <IconeCoracao />
          <span className="sr-only">{t.curtidas}</span>
          {curtidas}
        </span>
        <span className="inline-flex items-center gap-1">
          <IconeConversa />
          {t.respostas(d.total_respostas)}
        </span>
        <span className="ml-auto truncate">
          {d.autora} · {formatarData(new Date(d.created_at))}
        </span>
      </div>
    </Link>
  )
}
