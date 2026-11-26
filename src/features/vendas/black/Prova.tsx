import { Bloco, Titulo } from './base'
import { black } from './textos'

const t = black.prova
const FOTOS = Array.from({ length: 14 }, (_, i) => `/black/antes-depois-${dois2(i + 1)}.jpg`)
function dois2(n: number) {
  return String(n).padStart(2, '0')
}

/** Prova social: antes e depois de pacientes da Ana, em carrossel no celular e grade no computador. */
export function Prova() {
  return (
    <Bloco id="resultados">
      <Titulo etiqueta={t.etiqueta} titulo={t.titulo} destaque={t.destaque} />
      <p className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-creme/70">{t.texto}</p>
      <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {FOTOS.map((src, i) => (
          <li
            key={src}
            className="w-[78%] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-[#111614] sm:w-auto"
          >
            <img
              src={src}
              alt={t.alt(i + 1)}
              loading="lazy"
              width={720}
              height={720}
              className="aspect-square w-full object-cover object-top"
            />
          </li>
        ))}
      </ul>
      <p className="mt-2 text-center text-xs text-creme/50 sm:hidden">{t.arrastar}</p>
      <p className="mt-6 text-center text-xs text-creme/45">{t.nota}</p>
    </Bloco>
  )
}
