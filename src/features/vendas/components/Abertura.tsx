import { textos } from '../textos'
import { BotaoCompra } from './BotaoCompra'
import { Destaque } from './Destaque'
import { Secao } from './Secao'

export function Hero() {
  const t = textos.hero
  return (
    <header className="bg-areia">
      <div className="mx-auto max-w-3xl px-5 pt-10 pb-20 sm:pt-16 sm:pb-28">
        <img src="/logo-ora.png" alt={t.logo} width={482} height={189} className="h-12 w-auto" />
        <h1 className="mt-12 font-titulo text-[3.25rem] leading-[0.98] font-semibold tracking-tight text-ora sm:text-7xl">
          <Destaque texto={t.titulo} />
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-suave sm:text-xl">{t.subtitulo}</p>
        <div className="mt-10">
          <BotaoCompra>{t.botao}</BotaoCompra>
        </div>
        <p className="mt-4 text-sm text-suave">{t.seguro}</p>
      </div>
    </header>
  )
}

/** Três números grandes. Trocar por números de autoridade é só mexer em textos.numeros. */
export function Numeros() {
  return (
    <Secao>
      <ul className="grid gap-10 sm:grid-cols-3 sm:gap-6">
        {textos.numeros.map((n) => (
          <li key={n.rotulo} className="border-t border-linha pt-6">
            <p className="font-titulo text-7xl leading-none font-semibold text-terracota">
              {n.valor}
            </p>
            <p className="mt-3 text-lg font-bold text-ora">{n.rotulo}</p>
            <p className="mt-1 text-suave">{n.detalhe}</p>
          </li>
        ))}
      </ul>
    </Secao>
  )
}

export function Problema() {
  const t = textos.problema
  return (
    <Secao titulo={t.titulo} fundo="areia">
      <ul className="flex flex-col gap-3">
        {t.frases.map((f) => (
          <li key={f} className="text-2xl font-medium text-tinta sm:text-3xl">
            {f}
          </li>
        ))}
      </ul>
      <p className="mt-12 font-titulo text-4xl leading-tight font-semibold text-ora sm:text-5xl">
        <Destaque texto={t.fecho} />
      </p>
    </Secao>
  )
}
