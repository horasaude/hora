import { Link } from 'react-router-dom'
import { IconeCadeado } from '@/components/ui'
import { diasParaAbrir, type TemaTrilha } from '@/domain/trilha'
import { urlCapa } from '@/lib/capas'
import { useLinkTema } from '../previa'
import { textos } from '../textos'
import { IconeTema } from './Temas'

const t = textos.sequencia

function Situacao({ tema, dia }: { tema: TemaTrilha; dia: number }) {
  if (tema.em_breve)
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-suave">
        <IconeCadeado className="size-3.5" />
        {t.emBreve}
      </span>
    )
  if (!tema.aberto)
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-suave">
        <IconeCadeado className="size-3.5" />
        {t.abreEm(diasParaAbrir(tema, dia))}
      </span>
    )
  return (
    <span className="text-[13px] font-bold text-verde-vivo">{t.aberto(tema.aulas.length)}</span>
  )
}

/** Cartão do tema: capa, Tema N, nome, frase e se está aberto ou quando abre. */
function CartaoTema({ tema, n, dia }: { tema: TemaTrilha; n: number; dia: number }) {
  const link = useLinkTema()
  const capa = urlCapa(tema.capa)
  return (
    <li>
      <Link
        to={link(tema.id)}
        aria-label={t.abrir(tema.titulo)}
        className={`flex h-full flex-col overflow-hidden rounded-[20px] border border-linha bg-white transition hover:shadow-cartao active:scale-[0.99] ${tema.aberto ? '' : 'opacity-80'}`}
      >
        <span className="relative grid aspect-video place-items-center bg-verde-escuro text-white">
          {capa ? (
            <img
              src={capa}
              alt=""
              loading="lazy"
              className={`absolute inset-0 size-full object-cover ${tema.aberto ? '' : 'grayscale'}`}
            />
          ) : (
            <IconeTema chave={tema.chave} className="size-12 opacity-60" />
          )}
          {!tema.aberto && (
            <span className="absolute grid size-11 place-items-center rounded-full bg-white/90 text-verde-escuro">
              <IconeCadeado />
            </span>
          )}
        </span>
        <span className="flex flex-1 flex-col gap-1 p-4">
          <span className="text-[11px] font-bold tracking-wide text-suave uppercase">
            {t.temaN(n)}
          </span>
          <span className="text-[17px] leading-snug font-bold text-tinta">{tema.titulo}</span>
          {tema.frase && <span className="text-sm leading-snug text-suave">{tema.frase}</span>}
          <span className="mt-auto pt-2">
            <Situacao tema={tema} dia={dia} />
          </span>
        </span>
      </Link>
    </li>
  )
}

/** Temas em ordem: abertos para entrar e rever, os próximos com cadeado e quando abrem. */
export function ListaTemas({ temas, dia }: { temas: TemaTrilha[]; dia: number }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {temas.map((tema, i) => (
        <CartaoTema key={tema.id} tema={tema} n={i + 1} dia={dia} />
      ))}
    </ul>
  )
}
