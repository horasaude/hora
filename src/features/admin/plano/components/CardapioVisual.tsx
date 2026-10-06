import { macros, totalCardapio } from '@/domain/nutricao'
import type { FormCardapio } from '../cardapioForm'
import { textos } from '../textos'
import { tCardapios as t } from '../textos2'
import { ListaItens } from './ListaItens'

/** Como a aluna vê o cardápio (também é o conteúdo do PDF). */
export function CardapioVisual({ f }: { f: FormCardapio }) {
  const texto = f.modelo === 'texto'
  const total = totalCardapio(f.refeicoes)
  const m = macros(total)
  return (
    <article className="flex flex-col gap-5 text-tinta">
      <header>
        <h2 className="text-[24px] font-bold text-verde-escuro">{f.titulo}</h2>
        <p className="text-[13px] text-suave">
          {f.objetivo}
          {!texto &&
            ` · ${textos.kcal(total.kcal)} · P ${Math.round(m.proteina.gramas)} g · C ${Math.round(m.carboidrato.gramas)} g · G ${Math.round(m.gordura.gramas)} g`}
        </p>
      </header>
      {f.refeicoes.map((r) => (
        <section key={r.id} className="break-inside-avoid border-t border-[#ECEFED] pt-3">
          <h3 className="mb-1.5 text-[15px] font-bold text-verde-escuro">
            {r.nome} {r.horario && <span className="font-normal text-suave">· {r.horario}</span>}
          </h3>
          <ListaItens itens={r.itens} texto={texto ? r.texto : undefined} />
          {r.observacao && <p className="mt-1 text-xs text-suave italic">{r.observacao}</p>}
          {r.substitutas.map((s) => (
            <div key={s.id} className="mt-2 rounded-xl bg-[#F8FAF9] p-3">
              <p className="mb-1 text-[13px] font-bold">
                {t.substituta}: {s.nome}
              </p>
              <ListaItens itens={s.itens} texto={texto ? s.texto : undefined} />
            </div>
          ))}
        </section>
      ))}
      {f.lista.length > 0 && (
        <section className="break-inside-avoid border-t border-[#ECEFED] pt-3">
          <h3 className="mb-2 text-[15px] font-bold text-verde-escuro">{t.listaCompras}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {f.lista.map((g) => (
              <div key={g.grupo}>
                <p className="text-[11px] font-bold tracking-[0.08em] text-[#8A9692] uppercase">
                  {g.grupo}
                </p>
                <ul className="text-[13px]">
                  {g.itens.map((it, i) => (
                    <li key={i}>
                      {it.nome} · {it.quantidade}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
