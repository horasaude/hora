import { textos } from '../textos'
import { BotaoCompra } from './BotaoCompra'
import { Destaque } from './Destaque'
import { Secao } from './Secao'
import { VideoFundo } from './VideoFundo'

/** Celular: vídeo em tela cheia com véu escuro. Computador: texto no creme e o vídeo em quadro alto. */
export function Hero() {
  const t = textos.hero
  return (
    <header className="relative bg-creme">
      <div className="relative mx-auto grid min-h-[calc(100svh-3.5rem)] max-w-6xl lg:min-h-0 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:px-8 lg:py-16">
        <div className="absolute inset-0 lg:relative lg:order-2 lg:flex lg:justify-end">
          <VideoFundo className="h-full w-full object-cover lg:aspect-[9/16] lg:h-[78vh] lg:max-h-[760px] lg:w-auto lg:rounded-[2rem]" />
          <div aria-hidden="true" className="absolute inset-0 bg-tinta/50 lg:hidden" />
        </div>
        <div className="relative flex flex-col justify-end px-5 pt-20 pb-12 text-creme lg:order-1 lg:p-0 lg:text-ora">
          <img
            src="/logo-ora.png"
            alt={t.logo}
            width={482}
            height={189}
            className="h-10 w-auto self-start brightness-0 invert lg:brightness-100 lg:invert-0"
          />
          <p className="mt-10 text-[0.7rem] font-medium tracking-[0.22em] uppercase italic opacity-80">
            {t.etiqueta}
          </p>
          <h1 className="mt-4 text-[4.75rem] sm:text-8xl lg:text-[7.5rem]">
            <Destaque texto={t.titulo} />
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed font-light text-creme/90 sm:text-lg lg:text-suave">
            {t.subtitulo}
          </p>
          <div className="mt-10">
            <BotaoCompra variante="heroi">{t.botao}</BotaoCompra>
          </div>
          <p className="mt-4 text-xs tracking-wide text-creme/80 lg:text-suave">{t.seguro}</p>
        </div>
      </div>
    </header>
  )
}

/** Três números grandes. Trocar por números de autoridade é só mexer em textos.numeros. */
export function Numeros() {
  return (
    <Secao etiqueta={textos.numerosEtiqueta} fundo="branco">
      <ul className="grid gap-8 sm:grid-cols-3">
        {textos.numeros.map((n) => (
          <li
            key={n.rotulo}
            className="grid grid-cols-[6.5rem_1fr] items-center gap-4 border-t border-linha pt-6 sm:block"
          >
            <p className="font-titulo text-7xl leading-none text-ora sm:text-8xl">{n.valor}</p>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-ora uppercase sm:mt-4">
                {n.rotulo}
              </p>
              <p className="mt-1 text-sm font-light text-suave italic sm:mt-2 sm:text-base">
                {n.detalhe}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Secao>
  )
}

export function Problema() {
  const t = textos.problema
  return (
    <Secao etiqueta={t.etiqueta} titulo={t.titulo} marca>
      <ul className="flex flex-col gap-3">
        {t.frases.map((f) => (
          <li key={f} className="text-2xl font-light text-tinta sm:text-3xl">
            {f}
          </li>
        ))}
      </ul>
      <p className="mt-16 text-6xl text-ora sm:text-7xl">
        <Destaque texto={t.fecho} />
      </p>
    </Secao>
  )
}
