import { textos } from '../textos'

const t = textos.garantia

/** Selo pequeno de garantia, logo abaixo dos planos. */
export function Garantia() {
  return (
    <div className="mx-auto mt-8 flex max-w-xl items-center gap-4 rounded-[1.5rem] border border-ora/15 bg-white px-5 py-4">
      <div className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-ora text-center text-[0.6rem] leading-tight font-semibold tracking-[0.1em] text-ora uppercase">
        {t.selo}
      </div>
      <div>
        <p className="text-sm font-semibold text-ora">{t.titulo}</p>
        <p className="mt-0.5 text-sm text-tinta">{t.texto}</p>
      </div>
    </div>
  )
}
