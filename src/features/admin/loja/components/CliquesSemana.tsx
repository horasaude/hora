import { diaMesDeData } from '@/lib/datas'
import { useCliquesSemana } from '../hooks/useLoja'
import { t } from '../textos'

/** Barras simples com os cliques das últimas 8 semanas (semana começa na segunda). */
export function CliquesSemana({ produto }: { produto: string }) {
  const dados = useCliquesSemana(produto).data
  if (!dados) return null
  const maior = Math.max(1, ...dados.map((d) => d.cliques))
  const total = dados.reduce((s, d) => s + d.cliques, 0)
  return (
    <section className="flex flex-col gap-3 border-t border-[#F0F2F1] pt-4">
      <h3 className="text-base font-bold text-verde-escuro">{t.cliquesSemana}</h3>
      {total === 0 ? (
        <p className="text-[13px] text-suave">{t.semCliques}</p>
      ) : (
        <ol className="flex h-36 items-end gap-2" aria-label={t.cliquesSemana}>
          {dados.map((d) => (
            <li key={d.semana} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[11px] font-bold text-tinta">{d.cliques}</span>
              <span
                className="brilho brilho-dourado w-full rounded-t-lg"
                style={{ height: `${Math.max(4, (d.cliques / maior) * 88)}px` }}
              />
              <span className="text-[10px] text-suave">{diaMesDeData(d.semana)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
