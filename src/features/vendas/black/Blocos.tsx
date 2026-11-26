import { Bloco, Titulo } from './base'
import { black } from './textos'

/** A dor: as frases de quem sempre recomeça. */
export function Problema() {
  const t = black.problema
  return (
    <Bloco>
      <Titulo etiqueta={t.etiqueta} titulo={t.titulo} destaque={t.destaque} />
      <ul className="mx-auto mt-10 flex max-w-md flex-col gap-3">
        {t.frases.map((f) => (
          <li
            key={f}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-lg text-creme/80"
          >
            {f}
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-10 max-w-xl text-center font-titulo text-2xl text-creme italic sm:text-3xl">
        {t.fecho}
      </p>
    </Bloco>
  )
}

/** As três profissionais, com foto. */
export function Equipe() {
  const t = black.equipe
  return (
    <Bloco>
      <Titulo etiqueta={t.etiqueta} titulo={t.titulo} destaque={t.destaque} />
      <ul className="mt-10 grid gap-5 sm:grid-cols-3">
        {t.pessoas.map((p) => (
          <li
            key={p.nome}
            className="overflow-hidden rounded-3xl border border-white/10 bg-[#111614]"
          >
            <img
              src={p.foto}
              alt={p.nome}
              loading="lazy"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="px-5 py-4">
              <p className="font-titulo text-xl text-creme">{p.nome}</p>
              <p className="text-sm text-verde-vivo">{p.papel}</p>
            </div>
          </li>
        ))}
      </ul>
    </Bloco>
  )
}

/** Tudo o que entra no plano, com o verde marcando cada item. */
export function Recebe() {
  const t = black.recebe
  return (
    <Bloco>
      <Titulo etiqueta={t.etiqueta} titulo={t.titulo} destaque={t.destaque} />
      <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
        {t.itens.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-creme/85"
          >
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-verde-vivo text-[#04140d]">
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                aria-hidden="true"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Bloco>
  )
}

/** Perguntas da Black em acordeão nativo. */
export function Perguntas() {
  const t = black.perguntas
  return (
    <Bloco>
      <Titulo etiqueta="" titulo={t.titulo} destaque={t.destaque} />
      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3">
        {t.itens.map((i) => (
          <details
            key={i.p}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-creme">
              {i.p}
              <span
                className="text-xl text-verde-vivo transition group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-creme/70">{i.r}</p>
          </details>
        ))}
      </div>
    </Bloco>
  )
}
