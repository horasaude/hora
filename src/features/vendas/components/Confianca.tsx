import { textos } from '../textos'
import { Secao } from './Secao'

/** Pronto para 1º, 2º e 3º lugar e a linha do ranking anual. */
export function Premios() {
  const t = textos.premios
  return (
    <Secao etiqueta={t.etiqueta} titulo={t.titulo} fundo="branco">
      <ol className="grid gap-4 sm:grid-cols-3">
        {t.posicoes.map((p) => (
          <li key={p.lugar} className="border-t border-linha pt-6">
            <p className="font-titulo text-5xl text-ora uppercase">{p.lugar}</p>
            <p className="mt-2 text-lg font-light text-tinta italic">{p.premio}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10 text-xs font-semibold tracking-[0.2em] text-ora uppercase">{t.anual}</p>
    </Secao>
  )
}

export function Garantia() {
  const t = textos.garantia
  return (
    <Secao etiqueta={t.etiqueta} titulo={t.titulo} fundo="ora" marca>
      <p className="max-w-xl text-xl leading-relaxed font-light text-creme/90">{t.texto}</p>
    </Secao>
  )
}

export function Perguntas() {
  const t = textos.perguntas
  return (
    <Secao etiqueta={t.etiqueta} titulo={t.titulo}>
      <div>
        {t.itens.map((item) => (
          <details key={item.p} className="group border-t border-ora/20 last:border-b">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg text-ora [&::-webkit-details-marker]:hidden">
              {item.p}
              <span
                aria-hidden="true"
                className="relative size-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-ora after:absolute after:top-0 after:left-1/2 after:h-4 after:w-px after:bg-ora group-open:after:hidden"
              />
            </summary>
            <p className="pb-6 text-lg leading-relaxed font-light text-tinta">{item.r}</p>
          </details>
        ))}
      </div>
    </Secao>
  )
}
