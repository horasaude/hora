import { textos } from '../textos'
import { Secao } from './Secao'

export function OQueE() {
  const t = textos.oQueE
  return (
    <Secao etiqueta={t.etiqueta} titulo={t.titulo} fundo="branco">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xl leading-relaxed text-tinta sm:text-2xl">{t.texto}</p>
          <ul className="mt-8 flex flex-col">
            {t.pilares.map((p) => (
              <li
                key={p.nome}
                className="flex items-baseline justify-between gap-4 border-t border-linha py-4 last:border-b"
              >
                <span className="font-titulo text-3xl text-ora uppercase">{p.nome}</span>
                <span className="text-sm text-suave italic">{p.quem}</span>
              </li>
            ))}
          </ul>
        </div>
        <img
          src={t.foto}
          alt={t.fotoAlt}
          width={1000}
          height={1500}
          loading="lazy"
          className="aspect-[2/3] w-full rounded-[2rem] object-cover"
        />
      </div>
    </Secao>
  )
}

export function ComoFunciona() {
  const t = textos.comoFunciona
  return (
    <Secao etiqueta={t.etiqueta} titulo={t.titulo} marca>
      <ol className="grid gap-3 sm:grid-cols-2">
        {t.passos.map((p, i) => (
          <li key={p.titulo} className="flex gap-4 rounded-[1.5rem] bg-white p-5">
            <span className="w-12 shrink-0 font-titulo text-5xl leading-none text-salvia tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.14em] text-ora uppercase">
                {p.titulo}
              </p>
              <p className="mt-2 text-tinta">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </Secao>
  )
}
