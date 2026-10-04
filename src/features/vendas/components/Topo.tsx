import { textos } from '../textos'
import { LinkBotao } from './Secao'

export function Topo() {
  const t = textos.topo
  return (
    <header className="bg-white px-4 pt-10 pb-16">
      <div className="mx-auto flex max-w-2xl flex-col items-start gap-6">
        <img src="/logo-ora.png" alt={t.logo} width={482} height={189} className="h-auto w-28" />
        <p className="text-sm font-semibold tracking-wide text-terracota uppercase">{t.selo}</p>
        <h1 className="font-titulo text-4xl leading-tight text-ora sm:text-5xl">{t.promessa}</h1>
        <p className="max-w-prose text-lg text-suave">{t.apoio}</p>
        <LinkBotao href="#precos">{t.botao}</LinkBotao>
      </div>
    </header>
  )
}
