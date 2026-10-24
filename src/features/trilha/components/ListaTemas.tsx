import { Link } from 'react-router-dom'
import { EtiquetaBrilho, IconeCadeado, IconePlay } from '@/components/ui'
import { diasParaAbrir, type TemaTrilha } from '@/domain/trilha'
import { urlCapa } from '@/lib/capas'
import { useLinkTema } from '../previa'
import { textos } from '../textos'
import { CapaAutomatica } from './CapaAutomatica'
import { IconeRelogio } from './IconesTrilha'

const t = textos.sequencia

/** Faixa branca embaixo da capa: aulas e dias do tema aberto, ou quando abre, com a etiqueta. */
function Situacao({ tema, dia, proximo }: { tema: TemaTrilha; dia: number; proximo: boolean }) {
  if (tema.aberto) {
    const feitas = tema.aulas.filter((a) => a.concluida).length
    return (
      <>
        <span className="text-[13px] font-bold text-tinta">
          {t.aulasEDias(feitas, tema.aulas.length, tema.dias)}
        </span>
        <EtiquetaBrilho tom="verde">
          <IconePlay className="mr-1 size-2.5" />
          {t.abertoEtiqueta}
        </EtiquetaBrilho>
      </>
    )
  }
  const quando = tema.em_breve
    ? ''
    : proximo
      ? t.abreEm(diasParaAbrir(tema, dia))
      : t.abreNoDia(tema.inicio)
  return (
    <>
      <span className="text-[13px] text-suave">{quando}</span>
      <EtiquetaBrilho tom="cinza">
        <IconeRelogio className="mr-1 size-3" />
        {t.emBreve}
      </EtiquetaBrilho>
    </>
  )
}

type Cartao = { tema: TemaTrilha; dia: number; proximo: boolean }

/** Cartão do tema: capa 16:9 com o nome escrito e, embaixo, se está aberto ou quando abre. */
function CartaoTema({ tema, dia, proximo }: Cartao) {
  const link = useLinkTema()
  const capa = urlCapa(tema.capa)
  return (
    <li>
      <Link
        to={link(tema.id)}
        aria-label={t.abrir(tema.titulo)}
        className={`flex h-full flex-col overflow-hidden rounded-[20px] border border-linha bg-white transition hover:shadow-cartao active:scale-[0.99]`}
      >
        <span className="relative flex aspect-video flex-col justify-end bg-verde-escuro p-4 text-white">
          {capa ? (
            <>
              <img
                src={capa}
                alt=""
                loading="lazy"
                className={`absolute inset-0 size-full object-cover object-[center_35%] ${tema.aberto ? '' : 'grayscale-[.55]'}`}
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              />
            </>
          ) : (
            <CapaAutomatica chave={tema.chave} cor={tema.cor} icone="size-12 opacity-50" direita />
          )}
          {!tema.aberto && (
            <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 text-verde-escuro">
              <IconeCadeado />
            </span>
          )}
          <span className="relative text-[24px] leading-tight font-bold">{tema.titulo}</span>
        </span>
        <span className="flex items-center justify-between gap-2 px-3.5 pt-2.5 pb-3">
          <Situacao tema={tema} dia={dia} proximo={proximo} />
        </span>
      </Link>
    </li>
  )
}

/** Temas em ordem: abertos para entrar e rever, os próximos com cadeado e quando abrem. */
export function ListaTemas({ temas, dia }: { temas: TemaTrilha[]; dia: number }) {
  const proximo = temas.find((x) => !x.aberto && !x.em_breve && x.inicio > dia)
  return (
    <ul className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {temas.map((tema) => (
        <CartaoTema key={tema.id} tema={tema} dia={dia} proximo={tema.id === proximo?.id} />
      ))}
    </ul>
  )
}
