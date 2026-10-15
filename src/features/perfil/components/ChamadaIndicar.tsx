import { LinkBrilho } from '@/components/ui'
import { textos } from '../textos'

const t = textos.chamadaIndicar

/** Início: chamada curta para indicar uma amiga, que leva ao link na aba Desafios. */
export function ChamadaIndicar() {
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-gradient-to-r from-[#FFF6E5] to-white p-4 shadow-cartao lg:p-5">
      <div>
        <h2 className="text-base font-bold text-verde-escuro">{t.titulo}</h2>
        <p className="text-sm text-suave">{t.texto}</p>
      </div>
      <LinkBrilho to="/app/desafios#indicar" tom="dourado">
        {t.botao}
      </LinkBrilho>
    </section>
  )
}
