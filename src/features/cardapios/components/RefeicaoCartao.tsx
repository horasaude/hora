import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cartao } from '@/components/ui'
import { macros, rotuloOpcao, totalItens, type Item, type Refeicao } from '@/domain/nutricao'
import { RegistrarRefeicao } from '@/features/checkin'
import { textos } from '../textos'

function Totais({ itens }: { itens: Item[] }) {
  const total = totalItens(itens)
  const m = macros(total)
  return (
    <p className="text-[12px] text-suave">
      {textos.totais(total.kcal, m.proteina.gramas, m.carboidrato.gramas, m.gordura.gramas)}
    </p>
  )
}

/** Itens com medida caseira e gramas; receita vira link. Com "ou", mostra só se pedir as substituições. */
function Itens({ itens, comOu }: { itens: Item[]; comOu: boolean }) {
  return (
    <ul className="flex flex-col gap-1.5 text-[15px]">
      {itens.map((it, i) => (
        <li key={i}>
          {it.opcoes.slice(0, comOu ? undefined : 1).map((o, j) => (
            <p key={j} className={j > 0 ? 'pl-4 text-[14px] text-suave' : 'text-tinta'}>
              {j > 0 && <b className="mr-1 text-[11px] uppercase">{textos.ou}</b>}
              {o.tipo === 'receita' ? (
                <Link
                  to={`/app/cardapios/receitas/${o.ref_id}`}
                  className="font-bold text-verde-escuro underline underline-offset-2"
                >
                  {o.nome}
                </Link>
              ) : (
                o.nome
              )}
              <span className="text-suave"> · {rotuloOpcao(o)}</span>
            </p>
          ))}
        </li>
      ))}
    </ul>
  )
}

/** Uma refeição: horário, itens, substituições sob demanda, totais discretos e Registrar refeição. */
export function RefeicaoCartao({ r, texto }: { r: Refeicao; texto: boolean }) {
  const [subs, setSubs] = useState(false)
  const temOu = r.itens.some((i) => i.opcoes.length > 1) || r.substitutas.length > 0
  return (
    <Cartao className="flex h-full flex-col gap-3">
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="text-[17px] font-bold text-verde-escuro">{r.nome}</h2>
        {r.horario && <span className="text-sm font-bold text-suave">{r.horario}</span>}
      </header>
      {texto ? (
        <p className="text-[15px] leading-relaxed whitespace-pre-line text-tinta">{r.texto}</p>
      ) : (
        <Itens itens={r.itens} comOu={subs} />
      )}
      {r.observacao && <p className="text-[13px] text-suave italic">{r.observacao}</p>}
      {subs &&
        r.substitutas.map((s) => (
          <div key={s.id} className="rounded-[14px] bg-trilho/60 p-3">
            <p className="mb-1 text-[13px] font-bold text-tinta">{textos.troca(s.nome)}</p>
            {texto ? (
              <p className="text-[14px] whitespace-pre-line">{s.texto}</p>
            ) : (
              <Itens itens={s.itens} comOu />
            )}
          </div>
        ))}
      <div className="mt-auto flex flex-col gap-3 border-t border-linha pt-3">
        {!texto && <Totais itens={r.itens} />}
        <div className="flex flex-wrap items-center gap-2">
          <RegistrarRefeicao rotulo={textos.registrar} />
          {temOu && (
            <button
              type="button"
              aria-expanded={subs}
              onClick={() => setSubs((v) => !v)}
              className="text-sm font-bold text-verde-escuro underline underline-offset-2"
            >
              {subs ? textos.esconder : textos.substituicoes}
            </button>
          )}
        </div>
      </div>
    </Cartao>
  )
}
