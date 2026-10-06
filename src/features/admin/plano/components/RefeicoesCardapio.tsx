import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import type { Refeicao } from '@/domain/nutricao'
import { copiarRefeicao } from '../cardapioForm'
import { tCardapios as t } from '../textos2'
import { JanelasRefeicao, type Editando } from './JanelasRefeicao'
import { RefeicaoBloco } from './RefeicaoBloco'

type Props = {
  refeicoes: Refeicao[]
  textoLivre: boolean
  mudar: (fn: (r: Refeicao[]) => Refeicao[]) => void
}

/** Refeições do cardápio em blocos, com adicionar, carregar modelo, editar, duplicar, remover e substituições. */
export function RefeicoesCardapio({ refeicoes, textoLivre, mudar }: Props) {
  const [ed, setEd] = useState<Editando>(null)
  const trocar = (i: number, fn: (r: Refeicao) => Refeicao) =>
    mudar((lista) => lista.map((r, k) => (k === i ? fn(r) : r)))
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-verde-escuro">{t.refeicoes}</h2>
        <div className="flex flex-wrap gap-2">
          <BotaoBrilho tom="dourado" onClick={() => setEd({ tipo: 'nova' })}>
            + {t.adicionarRefeicao}
          </BotaoBrilho>
          {!textoLivre && (
            <BotaoBrilho tom="cinza" onClick={() => setEd({ tipo: 'modelo' })}>
              {t.carregarModelo}
            </BotaoBrilho>
          )}
        </div>
      </div>
      {refeicoes.length === 0 && (
        <p className="rounded-[18px] border border-dashed border-[#ECEFED] p-6 text-center text-[13px] text-suave">
          {t.semRefeicoes}
        </p>
      )}
      {refeicoes.map((r, i) => (
        <RefeicaoBloco
          key={r.id}
          r={r}
          textoLivre={textoLivre}
          aoDuplicar={() =>
            mudar((l) => [...l.slice(0, i + 1), copiarRefeicao(r), ...l.slice(i + 1)])
          }
          aoEditar={() => setEd({ tipo: 'refeicao', i })}
          aoRemover={() => mudar((l) => l.filter((_, k) => k !== i))}
          aoNovaSub={() => setEd({ tipo: 'sub', i, j: null })}
          aoEditarSub={(j) => setEd({ tipo: 'sub', i, j })}
          aoRemoverSub={(j) =>
            trocar(i, (x) => ({ ...x, substitutas: x.substitutas.filter((_, k) => k !== j) }))
          }
        />
      ))}
      <JanelasRefeicao
        ed={ed}
        setEd={setEd}
        refeicoes={refeicoes}
        textoLivre={textoLivre}
        mudar={mudar}
        trocar={trocar}
      />
    </section>
  )
}
