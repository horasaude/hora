import { Link } from 'react-router-dom'
import { Cartao, EtiquetaBrilho, IconePlay } from '@/components/ui'
import type { AulaTrilha, TemaTrilha } from '@/domain/trilha'
import { urlCapa } from '@/lib/capas'
import { textos } from '../textos'

const t = textos.aula

/** Continue de onde parou: miniatura do vídeo, tema e número da aula, título. */
export function ContinueAula({ aula, tema }: { aula: AulaTrilha; tema: TemaTrilha }) {
  const capa = urlCapa(aula.capa) ?? aula.miniatura ?? urlCapa(tema.capa)
  const numero = tema.aulas.findIndex((a) => a.id === aula.id) + 1
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[15px] font-bold text-tinta">{t.titulo}</h2>
      <Link to={`/app/trilha/aula/${aula.id}`} aria-label={t.abrir(aula.titulo)}>
        <Cartao className="flex items-center gap-3 p-3 transition hover:shadow-menu lg:p-4">
          <span
            className="relative grid aspect-video w-[104px] shrink-0 place-items-center overflow-hidden rounded-xl bg-verde-escuro bg-cover bg-center lg:w-36"
            style={capa ? { backgroundImage: `url(${capa})` } : undefined}
          >
            <span className="brilho brilho-escuro grid size-8 place-items-center rounded-full">
              <IconePlay className="ml-0.5 size-3" />
            </span>
          </span>
          <span className="flex min-w-0 flex-col items-start gap-1.5">
            <EtiquetaBrilho tom="verde">{t.etiqueta(tema.titulo, numero)}</EtiquetaBrilho>
            <span className="text-[15px] leading-snug font-bold text-tinta">{aula.titulo}</span>
            {aula.duracao_minutos ? (
              <span className="text-[13px] text-suave">{t.duracao(aula.duracao_minutos)}</span>
            ) : null}
          </span>
        </Cartao>
      </Link>
    </section>
  )
}
