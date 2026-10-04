import { textos } from '../textos'
import { Secao } from './Secao'

export function OQueE() {
  const t = textos.oQueE
  return (
    <Secao titulo={t.titulo}>
      <p className="text-xl leading-relaxed text-tinta sm:text-2xl">{t.texto}</p>
      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {t.pilares.map((p) => (
          <li key={p.nome} className="rounded-2xl bg-areia p-6">
            <p className="font-titulo text-3xl font-semibold text-ora">{p.nome}</p>
            <p className="mt-1 text-suave">{p.quem}</p>
          </li>
        ))}
      </ul>
    </Secao>
  )
}

export function ComoFunciona() {
  const t = textos.comoFunciona
  return (
    <Secao titulo={t.titulo} fundo="areia">
      <ol className="flex flex-col">
        {t.passos.map((p, i) => (
          <li key={p.titulo} className="flex gap-5 border-t border-linha py-6 last:border-b">
            <span className="w-14 shrink-0 font-titulo text-4xl leading-none font-semibold text-terracota tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="text-xl font-bold text-ora">{p.titulo}</p>
              <p className="mt-1 text-suave">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </Secao>
  )
}
