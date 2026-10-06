import { useState } from 'react'
import { textos } from '../../textos'

const t = textos.app.plano

/** Tela Plano: cardápio com substituições ou o treino do dia. */
export function TelaPlano() {
  const [aba, setAba] = useState(0)
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 rounded-xl bg-creme p-1">
        {t.abas.map((nome, i) => (
          <button
            key={nome}
            type="button"
            onClick={() => setAba(i)}
            className={`rounded-lg py-1.5 text-[0.7rem] font-semibold transition ${aba === i ? 'bg-white text-ora shadow-sm' : 'text-suave'}`}
          >
            {nome}
          </button>
        ))}
      </div>
      {aba === 0 ? (
        <ul className="flex flex-col gap-2">
          {t.refeicoes.map((r) => (
            <li key={r.hora} className="rounded-2xl border border-linha bg-white p-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-ora">
                <span className="rounded-md bg-ora px-1.5 py-0.5 text-[0.6rem] text-creme">
                  {r.hora}
                </span>
                {r.nome}
              </p>
              <p className="mt-1 text-[0.7rem] text-tinta">{r.itens}</p>
              <p className="mt-0.5 text-[0.65rem] text-suave italic">{r.troca}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-linha bg-white p-3">
          <p className="text-xs font-semibold text-ora">{t.treinoTitulo}</p>
          <ul className="mt-2 flex flex-col gap-2">
            {t.treino.map((e) => (
              <li key={e.nome} className="flex items-center gap-3">
                <span className="grid h-9 w-12 place-items-center rounded-lg bg-salvia">
                  <span className="ml-0.5 border-y-[6px] border-l-[9px] border-y-transparent border-l-white" />
                </span>
                <span className="flex-1 text-xs text-tinta">{e.nome}</span>
                <span className="text-[0.65rem] font-semibold text-suave">{e.detalhe}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
