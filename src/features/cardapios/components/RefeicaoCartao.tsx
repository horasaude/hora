import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  macros,
  rotuloOpcao,
  totalItens,
  type Item,
  type Opcao,
  type Refeicao,
} from '@/domain/nutricao'
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

function NomeOpcao({ o }: { o: Opcao }) {
  return o.tipo === 'receita' ? (
    <Link
      to={`/app/cardapios/receitas/${o.ref_id}`}
      className="font-bold text-verde-escuro underline underline-offset-2"
    >
      {o.nome}
    </Link>
  ) : (
    <>{o.nome}</>
  )
}

/** Um alimento por linha (somam na refeição): nome à esquerda, quantidade à direita; o "ou" na mesma linha. */
function Itens({ itens }: { itens: Item[] }) {
  return (
    <ul className="flex flex-col gap-1.5 text-[14px]">
      {itens.map((it, i) => (
        <li key={i} className="flex justify-between gap-3">
          <span className="text-tinta">
            {it.opcoes.map((o, j) => (
              <span key={j}>
                {j > 0 && <span className="text-[13px] text-suave"> {textos.ou} </span>}
                <NomeOpcao o={o} />
                {j > 0 && <span className="text-[12px] text-suave"> ({rotuloOpcao(o)})</span>}
              </span>
            ))}
          </span>
          {it.opcoes[0] && (
            <span className="shrink-0 text-right text-[12px] text-suave">
              {rotuloOpcao(it.opcoes[0])}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

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
  const trocas = r.substitutas.length
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
        <Itens itens={r.itens} />
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
              <Itens itens={s.itens} />
            )}
            {s.observacao && <p className="mt-1 text-[13px] text-suave">{s.observacao}</p>}
          </div>
        ))}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-linha pt-2.5">
        {!texto && <Totais itens={r.itens} />}
        <RegistrarRefeicao rotulo={textos.registrar} />
      </div>
    </article>
  )
}
