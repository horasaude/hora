import { textos } from '../textos'
import { BotaoCompra } from './BotaoCompra'
import { Destaque } from './Destaque'
import { Secao } from './Secao'
import { VideoFundo } from './VideoFundo'

/** Vídeo cobrindo toda a primeira dobra, com véu verde-escuro e texto centralizado por cima. */
export function Hero() {
  const t = textos.hero
  return (
    <header className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ora text-creme">
      <VideoFundo className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-tinta/65" />
      <div className="mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8">
        <img
          src="/logo-ora.png"
          alt={t.logo}
          width={482}
          height={189}
          className="h-9 w-auto brightness-0 invert sm:h-11"
        />
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-[0.7rem] font-medium tracking-[0.28em] text-creme/80 uppercase italic">
          {t.etiqueta}
        </p>
        <h1 className="mt-6 text-[5rem] sm:text-8xl lg:text-[9rem]">
          <Destaque texto={t.titulo} />
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-creme/90 sm:text-lg">
          {t.subtitulo}
        </p>
        <div className="mt-10 w-full sm:w-auto">
          <BotaoCompra variante="claro">{t.botao}</BotaoCompra>
        </div>
        <p className="mt-4 text-xs tracking-wide text-creme/80">{t.seguro}</p>
      </div>
    </header>
  )
}

/** Três números grandes. Trocar por números de autoridade é só mexer em textos.numeros. */
export function Numeros() {
  return (
    <Secao etiqueta={textos.numerosEtiqueta} fundo="branco">
      <ul className="grid gap-5 sm:grid-cols-3">
        {textos.numeros.map((n) => (
          <li
            key={n.rotulo}
            className="grid grid-cols-[6.5rem_1fr] items-center gap-4 border-t border-linha pt-4 sm:block"
          >
            <p className="font-titulo text-7xl leading-none text-ora sm:text-8xl">{n.valor}</p>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-ora uppercase sm:mt-4">
                {n.rotulo}
              </p>
              <p className="mt-1 text-sm text-suave italic sm:mt-2 sm:text-base">{n.detalhe}</p>
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
      <ul className="flex flex-col gap-2">
        {t.frases.map((f) => (
          <li key={f} className="text-2xl text-tinta sm:text-3xl">
            {f}
          </li>
        ))}
      </ul>
      <p className="mt-10 text-5xl text-ora sm:text-6xl">
        <Destaque texto={t.fecho} />
      </p>
    </Secao>
  )
}
