import type { TemaOpcao } from '@/domain/trilha'
import { urlCapa } from '@/lib/capas'
import { IconeTema } from './Temas'

/** Capa grande do tema no topo da trilha: imagem com o nome e a frase por cima; sem imagem, verde ORA com o ícone do tema. */
export function CapaTema({ tema, rotulo }: { tema: TemaOpcao; rotulo?: string }) {
  const capa = urlCapa(tema.capa)
  return (
    <section
      className={`relative -mx-5 flex min-h-44 flex-col justify-end overflow-hidden p-5 text-white sm:mx-0 sm:min-h-56 sm:rounded-[24px] sm:p-7 ${capa ? 'bg-tinta' : 'bg-verde-escuro'}`}
    >
      {capa && (
        <>
          <img src={capa} alt="" className="absolute inset-0 size-full object-cover" />
          <span aria-hidden className="absolute inset-0 bg-tinta/55" />
        </>
      )}
      {!capa && (
        <IconeTema chave={tema.chave} className="absolute top-5 right-5 size-16 opacity-30" />
      )}
      <div className="relative flex flex-col gap-1">
        {rotulo && (
          <span className="text-[12px] font-bold tracking-wide uppercase opacity-80">{rotulo}</span>
        )}
        <h2 className="text-[26px] leading-tight font-bold sm:text-[32px]">{tema.titulo}</h2>
        {tema.frase && (
          <p className="max-w-2xl text-[15px] leading-snug opacity-90">{tema.frase}</p>
        )}
      </div>
    </section>
  )
}
