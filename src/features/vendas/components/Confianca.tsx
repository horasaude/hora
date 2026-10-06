import { textos } from '../textos'
import { Secao } from './Secao'

export function Perguntas() {
  const t = textos.perguntas
  return (
    <Secao etiqueta={t.etiqueta} titulo={t.titulo} fundo="branco" lateral>
      <div>
        {t.itens.map((item) => (
          <details key={item.p} className="group border-t border-ora/20 last:border-b">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg text-ora [&::-webkit-details-marker]:hidden">
              {item.p}
              <span
                aria-hidden="true"
                className="relative size-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-ora after:absolute after:top-0 after:left-1/2 after:h-4 after:w-px after:bg-ora group-open:after:hidden"
              />
            </summary>
            <p className="pb-5 text-lg leading-relaxed text-tinta">{item.r}</p>
          </details>
        ))}
      </div>
    </Secao>
  )
}
