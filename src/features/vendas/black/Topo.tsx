import { LogoOra } from '@/components/ui'
import { BotaoBlack } from './base'
import { dois, useFaltaBlack } from './tempo'
import { black } from './textos'
import { VideoVsl } from './VideoVsl'

const t = black.hero

/** Faixa fixa no alto com a contagem até o fim da Black. */
export function Faixa() {
  const f = useFaltaBlack()
  return (
    <div className="sticky top-0 z-30 border-b border-verde-vivo/30 bg-[#050605]/95 px-4 py-2.5 text-center text-xs font-semibold tracking-[0.14em] text-creme uppercase backdrop-blur">
      {f ? (
        <>
          {black.faixa}{' '}
          <span role="timer" className="text-verde-vivo tabular-nums">
            {f.dias}d {dois(f.horas)}:{dois(f.minutos)}:{dois(f.segundos)}
          </span>
        </>
      ) : (
        black.encerrada
      )}
    </div>
  )
}

/** Primeira dobra: logo, selo da Black, promessa com o preço, vídeo e botão. */
export function Hero() {
  return (
    <header className="relative overflow-hidden px-5 pt-10 pb-16 text-center sm:pt-14">
      <LogoOra clara largura={96} className="mx-auto" />
      <p className="mx-auto mt-8 w-fit rounded-full border border-verde-vivo/50 bg-verde-vivo/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-verde-vivo uppercase">
        {t.etiqueta}
      </p>
      <h1 className="mx-auto mt-6 max-w-4xl font-titulo text-[2rem] leading-[1.1] text-creme sm:text-6xl">
        {t.titulo}{' '}
        <span className="mt-2 block font-texto text-6xl font-extrabold tracking-tight text-verde-vivo sm:text-8xl">
          {t.preco}
        </span>
        <span className="mt-1 block font-texto text-sm font-normal text-creme/60 sm:text-base">
          {t.porMes}
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-creme/75 sm:text-lg">
        {t.subtitulo}
      </p>
      <VideoVsl />
      <div className="mt-10">
        <BotaoBlack>{t.botao}</BotaoBlack>
      </div>
      <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-creme/60">
        {t.apoio.map((a) => (
          <li key={a} className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-verde-vivo" aria-hidden="true" />
            {a}
          </li>
        ))}
      </ul>
    </header>
  )
}
