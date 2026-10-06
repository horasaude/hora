import { textos } from '../textos'

/** Faixa de palavras passando sem parar. A lista vai duas vezes para o laço não ter emenda. */
export function Esteira() {
  const palavras = textos.app.esteira
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-linha bg-creme py-4">
      <div className="esteira flex w-max">
        {[...palavras, ...palavras].map((p, i) => (
          <span
            key={i}
            className="flex items-center gap-8 pr-8 font-titulo text-3xl whitespace-nowrap text-ora uppercase sm:text-4xl"
          >
            {p}
            <span className="size-1.5 rounded-full bg-salvia" />
          </span>
        ))}
      </div>
    </div>
  )
}
