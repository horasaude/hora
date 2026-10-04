import { textos } from '../textos'
import { Destaque } from './Destaque'
import { Secao } from './Secao'

/** Pronto para 1º, 2º e 3º lugar e a linha do ranking anual. */
export function Premios() {
  const t = textos.premios
  return (
    <Secao titulo={t.titulo}>
      <ol className="grid gap-4 sm:grid-cols-3">
        {t.posicoes.map((p) => (
          <li key={p.lugar} className="rounded-2xl bg-areia p-6">
            <p className="font-titulo text-4xl font-semibold text-terracota">{p.lugar}</p>
            <p className="mt-2 text-lg text-tinta">{p.premio}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-lg font-semibold text-ora">{t.anual}</p>
    </Secao>
  )
}

export function Garantia() {
  const t = textos.garantia
  return (
    <Secao fundo="areia">
      <div className="border-l-8 border-ocre pl-6 sm:pl-10">
        <p className="text-sm font-bold tracking-widest text-ora uppercase">{t.selo}</p>
        <h2 className="mt-2 font-titulo text-[2.5rem] leading-[1.05] font-semibold text-ora sm:text-6xl">
          <Destaque texto={t.titulo} />
        </h2>
        <p className="mt-5 text-xl leading-relaxed text-tinta">{t.texto}</p>
      </div>
    </Secao>
  )
}

export function Perguntas() {
  const t = textos.perguntas
  return (
    <Secao titulo={t.titulo}>
      <div>
        {t.itens.map((item) => (
          <details key={item.p} className="group border-t border-linha last:border-b">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-bold text-ora [&::-webkit-details-marker]:hidden">
              {item.p}
              <span
                aria-hidden="true"
                className="relative size-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-0.5 before:w-4 before:-translate-y-1/2 before:bg-terracota after:absolute after:top-0 after:left-1/2 after:h-4 after:w-0.5 after:-translate-x-1/2 after:bg-terracota group-open:after:hidden"
              />
            </summary>
            <p className="pb-6 text-lg leading-relaxed text-tinta">{item.r}</p>
          </details>
        ))}
      </div>
    </Secao>
  )
}
