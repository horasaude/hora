import { textos } from '../textos'
import { Destaque } from './Destaque'
import { Secao } from './Secao'
import { VideoFundo } from '@/components/shared/VideoFundo'

/** Vídeo cobrindo toda a primeira dobra, com véu verde-escuro e texto centralizado por cima. */
export function Hero() {
  const t = textos.hero
  return (
    <header className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ora text-creme">
      <VideoFundo className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-tinta/65" />
      <div className="mx-auto w-full max-w-6xl px-6 pt-10 sm:px-8 sm:pt-8">
        <img
          src="/logo-ora.png"
          alt={t.logo}
          width={482}
          height={189}
          className="h-9 w-auto brightness-0 invert sm:h-11"
        />
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="entrada text-[0.7rem] font-medium tracking-[0.28em] text-creme/80 uppercase italic">
          {t.etiqueta}
        </p>
        <h1 className="entrada mt-6 text-[5rem] sm:text-8xl lg:text-[9rem]">
          <Destaque texto={t.titulo} />
        </h1>
        <p className="entrada-2 mt-6 max-w-xl text-base leading-relaxed text-creme/90 sm:text-lg">
          {t.subtitulo}
        </p>
        <div className="entrada-3 mt-10 w-full sm:w-auto">
          <a
            href="#preco"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-creme px-6 text-sm font-semibold tracking-[0.1em] text-ora uppercase transition hover:-translate-y-0.5 hover:bg-white sm:w-auto sm:px-10 sm:tracking-[0.16em]"
          >
            {t.botao}
          </a>
        </div>
      </div>
    </header>
  )
}

/** Faixa compacta com três números, logo abaixo do vídeo. Trocar por números de autoridade é só mexer em textos.numeros. */
export function Numeros() {
  return (
    <section className="border-b border-linha bg-white">
      <ul className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-linha px-2 py-6 sm:py-8">
        {textos.numeros.map((n, i) => (
          <li
            key={n.rotulo}
            data-revelar
            style={{ transitionDelay: `${i * 120}ms` }}
            className="px-2 text-center"
          >
            <p className="font-titulo text-5xl leading-none text-ora sm:text-6xl">{n.valor}</p>
            <p className="mt-2 text-[0.65rem] font-semibold tracking-[0.16em] text-ora uppercase sm:text-xs">
              {n.rotulo}
            </p>
            <p className="mt-1 hidden text-sm text-suave italic sm:block">{n.detalhe}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Problema() {
  const t = textos.problema
  return (
    <Secao cta={t.cta} etiqueta={t.etiqueta} titulo={t.titulo} marca lateral>
      <ul className="flex flex-col gap-1.5">
        {t.frases.map((f) => (
          <li key={f} className="text-2xl text-tinta sm:text-3xl">
            {f}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-5xl text-ora">
        <Destaque texto={t.fecho} />
      </p>
    </Secao>
  )
}
