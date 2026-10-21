import { EtiquetaBrilho } from '@/components/ui'
import { CATEGORIAS, DIAS_SEMANA, porDiaDaSemana } from '@/domain/treinos'
import { proximoDaSequencia } from '@/domain/series'
import type { DiaRotina, Feito, RotinaAluna } from '../api/treinos.api'
import { textos } from '../textos'
import { Estado } from './Estado'
import { TreinoEmLista } from './TreinoEmLista'

const tt = textos.tipos
const ehAerobico = (d: DiaRotina) => d.treino.categoria === 'aerobico'
const categoria = (d: DiaRotina) =>
  CATEGORIAS[d.treino.categoria as keyof typeof CATEGORIAS] ?? d.treino.categoria

type Base = { rotina: RotinaAluna; feitosHoje: Set<string>; link: (id: string) => string }

/** Rotina por dia da semana: cada dia com os treinos dele (musculação e aeróbico), hoje em destaque. */
export function SemanaDoTipo({ rotina, dia, feitosHoje, link }: Base & { dia: number }) {
  const grupos = porDiaDaSemana(rotina.dias)
  if (grupos.length === 0) return <Estado tipo="vazio" texto={tt.vazioTipo} />
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-[19px] font-bold text-verde-escuro">{tt.semana}</h2>
      {grupos.map((g) => (
        <div key={g.dia} className="flex flex-col gap-2.5">
          <h3 className="flex items-center gap-2 text-[16px] font-bold text-tinta">
            {DIAS_SEMANA[g.dia]}
            {g.dia === dia && <EtiquetaBrilho tom="coral">{tt.hoje}</EtiquetaBrilho>}
          </h3>
          <ul className="flex flex-col gap-3">
            {g.itens.map((d) => (
              <li key={d.treino.id}>
                <TreinoEmLista
                  treino={d.treino}
                  rotulo={categoria(d)}
                  destaque={g.dia === dia}
                  feito={feitosHoje.has(d.treino.id)}
                  link={link(d.treino.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

type Sequencia = Base & { recentes: Feito[]; hoje: string }

/** Rotina numérica: Treino 1, 2, 3 abertos, com o da vez em destaque; aeróbicos à parte. */
export function SequenciaDoTipo({ rotina, feitosHoje, recentes, hoje, link }: Sequencia) {
  const musculacao = rotina.dias.filter((d) => !ehAerobico(d))
  const aerobicos = rotina.dias.filter(ehAerobico)
  const ordem = musculacao.map((d) => d.treino.id)
  const { indice, feitoHoje } = proximoDaSequencia(ordem, recentes, hoje)
  if (rotina.dias.length === 0) return <Estado tipo="vazio" texto={tt.vazioTipo} />
  const bloco = (titulo: string, lista: DiaRotina[], rotulo: (i: number) => string) =>
    lista.length > 0 && (
      <section className="flex flex-col gap-3">
        <h2 className="text-[19px] font-bold text-verde-escuro">{titulo}</h2>
        <ol className="flex flex-col gap-3">
          {lista.map((d, i) => (
            <li key={d.treino.id + i}>
              <TreinoEmLista
                treino={d.treino}
                rotulo={rotulo(i)}
                destaque={lista === musculacao && i === indice}
                feito={feitosHoje.has(d.treino.id)}
                link={link(d.treino.id)}
              />
            </li>
          ))}
        </ol>
      </section>
    )
  return (
    <>
      {bloco(tt.ordem, musculacao, (i) =>
        i === indice
          ? `${textos.treinoN(i + 1)} · ${feitoHoje ? textos.hoje : textos.daVez}`
          : textos.treinoN(i + 1),
      )}
      {bloco(tt.aerobicos, aerobicos, () => tt.aerobico)}
    </>
  )
}
