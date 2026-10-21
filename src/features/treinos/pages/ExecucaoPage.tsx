import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AvisoErro } from '@/components/ui'
import { letraCombinado, parceiros } from '@/domain/combinados'
import { seriesDoItem } from '@/domain/series'
import { progressoDoTreino } from '@/domain/treinos'
import type { TreinoCompleto } from '../api/treinos.api'
import { Concluido } from '../components/Concluido'
import { Navegacao, Topo } from '../components/ControlesTreino'
import { Descanso } from '../components/Descanso'
import { Estado } from '../components/Estado'
import { PassoExercicio, PassoTexto } from '../components/PassoExercicio'
import { useExecucao } from '../hooks/useExecucao'
import { useVoltarTreinos } from '../hooks/useLinkTreino'
import { useRegistrarFeito, useTreino } from '../hooks/useTreinos'
import { usePreviaTreinos } from '../previa'
import { textos } from '../textos'

const t = textos.execucao

/** Letra no bi-set e os nomes dos parceiros (null quando o exercício está sozinho). */
function combinadoDe(treino: TreinoCompleto, i: number) {
  const letra = letraCombinado(treino.itens, i)
  if (!letra) return null
  return {
    letra,
    com: parceiros(treino.itens, i).map((j) => treino.itens[j]?.exercicio.nome ?? ''),
  }
}

function Passo({ x, treino }: { x: ReturnType<typeof useExecucao>; treino: TreinoCompleto }) {
  const p = x.passo
  if (!p) return null
  if (p.tipo !== 'exercicio') return <PassoTexto titulo={t[p.tipo]} texto={p.texto} />
  return (
    <PassoExercicio
      item={p.item}
      aerobico={treino.categoria === 'aerobico'}
      combinado={combinadoDe(treino, p.indice)}
      feitas={x.marcadas[String(p.indice)] ?? 0}
      aoTocar={(s) =>
        x.tocarSerie(
          p.indice,
          s,
          seriesDoItem(p.item)[s]?.descanso_segundos ?? p.item.descanso_segundos,
        )
      }
    />
  )
}

function Execucao({ treino, voltar }: { treino: TreinoCompleto; voltar: string }) {
  const previa = usePreviaTreinos()
  const x = useExecucao(treino)
  const registrar = useRegistrarFeito()
  const [som, setSom] = useState(true)
  const series = progressoDoTreino(
    x.marcadas,
    treino.itens.map((i) => seriesDoItem(i).length),
  )
  const pct = Math.max(series, Math.round((x.atual / Math.max(1, x.passos.length)) * 100))
  if (x.concluido) return <Concluido voltar={voltar} previa={Boolean(previa)} />
  const concluir = () =>
    previa
      ? x.concluir()
      : registrar.mutate({ treino: treino.id, series: x.marcadas }, { onSuccess: x.concluir })
  return (
    <div className="flex flex-col gap-5">
      <Topo
        voltar={voltar}
        passo={t.passo(x.atual + 1, x.passos.length)}
        pct={pct}
        nome={treino.nome}
      />
      <Passo x={x} treino={treino} />
      {x.descanso && (
        <Descanso d={x.descanso} som={som} aoMudarSom={setSom} aoFechar={x.fecharDescanso} />
      )}
      <AvisoErro texto={registrar.isError ? t.erroSalvar : null} />
      <Navegacao x={x} concluir={concluir} ocupado={registrar.isPending} />
    </div>
  )
}

/** Treino em execução: tela cheia no celular, coluna central no computador. */
export function ExecucaoPage() {
  const { treinoId = '' } = useParams()
  const treino = useTreino(treinoId)
  const voltar = useVoltarTreinos()
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-white px-5 pt-5 font-sistema lg:static lg:z-auto lg:mx-auto lg:max-w-2xl lg:overflow-visible lg:p-0">
      {treino.isPending ? (
        <Estado tipo="carregando" />
      ) : treino.isError ? (
        <Estado tipo="erro" tentar={() => treino.refetch()} />
      ) : !treino.data ? (
        <Estado tipo="vazio" texto={textos.semRotina} />
      ) : (
        <Execucao treino={treino.data} voltar={voltar} />
      )}
    </div>
  )
}
