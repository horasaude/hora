import { useState } from 'react'
import { Link } from 'react-router-dom'
import { macros, rotuloOpcao, totalItens, type Item, type Refeicao } from '@/domain/nutricao'
import { RegistrarRefeicao } from '@/features/checkin'
import { textos } from '../textos'
import { IconeRefeicao } from './IconeRefeicao'
import { IconeTroca } from './IconesCardapio'

function Totais({ itens }: { itens: Item[] }) {
  const total = totalItens(itens)
  if (total.kcal <= 0) return null
  const m = macros(total)
  return (
    <p className="text-[12px] text-suave">
      {textos.totais(total.kcal, m.proteina.gramas, m.carboidrato.gramas, m.gordura.gramas)}
    </p>
  )
}

/** Itens: nome à esquerda, quantidade em cinza à direita; receita vira link. Com "ou", mostra as outras opções. */
function Itens({ itens, comOu }: { itens: Item[]; comOu: boolean }) {
  return (
    <ul className="flex flex-col gap-1.5 text-[14px]">
      {itens.flatMap((it, i) =>
        it.opcoes.slice(0, comOu ? undefined : 1).map((o, j) => (
          <li
            key={`${i}-${j}`}
            className={`flex justify-between gap-3 ${j > 0 ? 'pl-4 text-[13px]' : ''}`}
          >
            <span className="text-tinta">
              {j > 0 && <b className="mr-1 text-[11px] text-suave uppercase">{textos.ou}</b>}
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
            </span>
            <span className="shrink-0 text-right text-[12px] text-suave">{rotuloOpcao(o)}</span>
          </li>
        )),
      )}
    </ul>
  )
}

/** Quantas trocas a refeição tem: as opções "ou" dos itens e as refeições substitutas. */
const contarTrocas = (r: Refeicao) =>
  r.substitutas.length + r.itens.reduce((s, i) => s + Math.max(0, i.opcoes.length - 1), 0)

/** Uma refeição: ícone, nome, horário, itens, "N opções de troca", totais discretos e Registrar refeição. */
export function RefeicaoCartao({
  r,
  texto,
  ordem,
}: {
  r: Refeicao
  texto: boolean
  ordem: number
}) {
  const [subs, setSubs] = useState(false)
  const trocas = contarTrocas(r)
  return (
    <article className="flex h-full flex-col gap-2.5 rounded-[18px] border border-linha bg-white p-3.5">
      <header className="flex items-center gap-2">
        <IconeRefeicao nome={r.nome} ordem={ordem} />
        <h2 className="text-[15px] font-bold text-tinta">{r.nome}</h2>
        {r.horario && <span className="ml-auto text-[12px] font-bold text-suave">{r.horario}</span>}
      </header>
      {texto ? (
        <p className="text-[14px] leading-relaxed whitespace-pre-line text-tinta">{r.texto}</p>
      ) : (
        <Itens itens={r.itens} comOu={subs} />
      )}
      {r.observacao && <p className="text-[13px] text-suave italic">{r.observacao}</p>}
      {trocas > 0 && (
        <button
          type="button"
          aria-expanded={subs}
          onClick={() => setSubs((v) => !v)}
          className="inline-flex min-h-7 items-center gap-1.5 self-start text-[12px] font-bold text-coral"
        >
          <IconeTroca className="size-3.5" />
          {subs ? textos.esconder : textos.opcoesTroca(trocas)}
        </button>
      )}
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
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-linha pt-2.5">
        {!texto && <Totais itens={r.itens} />}
        <RegistrarRefeicao rotulo={textos.registrar} />
      </div>
    </article>
  )
}
