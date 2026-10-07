import { Link } from 'react-router-dom'
import type { ReceitaResumo } from '../api/receitas.api'
import { textos } from '../textos'

const t = textos.receitas

/** Receita na grade: foto, nome, tempo e rendimento. */
export function CartaoReceita({ r }: { r: ReceitaResumo }) {
  return (
    <Link
      to={`/app/cardapios/receitas/${r.id}`}
      className="block h-full rounded-[22px] focus-visible:outline-2 focus-visible:outline-ora"
    >
      <div className="flex h-full flex-col gap-3 overflow-hidden rounded-[22px] bg-white shadow-cartao transition hover:shadow-menu">
        {r.foto ? (
          <img
            src={r.foto}
            alt={t.fotoDe(r.nome)}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="aspect-[4/3] w-full bg-gradient-to-br from-salvia-suave to-areia"
          />
        )}
        <div className="flex flex-1 flex-col gap-1 px-5 pb-5">
          <h2 className="text-[16px] leading-snug font-bold text-tinta">
            {r.nome}
            {r.favorita && (
              <span className="ml-1 text-dourado" aria-label={t.favorita}>
                ★
              </span>
            )}
          </h2>
          <p className="mt-auto text-[13px] text-suave">
            {[r.tempo_minutos && t.tempo(r.tempo_minutos), t.rende(r.porcoes)]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
      </div>
    </Link>
  )
}
