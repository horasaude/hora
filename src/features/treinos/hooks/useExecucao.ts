import { useState } from 'react'
import { iniciarDescanso, type Descanso } from '@/domain/cronometro'
import type { SeriesMarcadas } from '@/domain/treinos'
import type { ExercicioDoTreino, TreinoCompleto } from '../api/treinos.api'

export type Passo =
  | { tipo: 'aquecimento' | 'alongamento'; texto: string }
  | { tipo: 'exercicio'; indice: number; item: ExercicioDoTreino }

/** Aquecimento (se houver), um passo por exercício e alongamento (se houver). */
export function montarPassos(t: TreinoCompleto): Passo[] {
  const passos: Passo[] = []
  if (t.aquecimento.trim()) passos.push({ tipo: 'aquecimento', texto: t.aquecimento })
  t.itens.forEach((item, indice) => passos.push({ tipo: 'exercicio', indice, item }))
  if (t.alongamento.trim()) passos.push({ tipo: 'alongamento', texto: t.alongamento })
  return passos
}

/** Estado do treino em execução: passo atual, séries marcadas e o descanso aberto. */
export function useExecucao(treino: TreinoCompleto) {
  const [passos] = useState(() => montarPassos(treino))
  const [atual, setAtual] = useState(() => {
    const pedido = Number(new URLSearchParams(window.location.search).get('passo'))
    return Number.isInteger(pedido) && pedido > 0 ? Math.min(pedido, passos.length - 1) : 0
  })
  const [marcadas, setMarcadas] = useState<SeriesMarcadas>({})
  const [descanso, setDescanso] = useState<Descanso | null>(null)
  const [concluido, setConcluido] = useState(false)

  /** Toca na bolinha: marca até ela (ou desmarca a última) e abre o descanso ao marcar. */
  const tocarSerie = (indice: number, serie: number, descansoSegundos: number) => {
    const chave = String(indice)
    const feitas = marcadas[chave] ?? 0
    const novo = serie < feitas ? serie : serie + 1
    setMarcadas({ ...marcadas, [chave]: novo })
    if (novo > feitas) setDescanso(iniciarDescanso(descansoSegundos, Date.now()))
  }
  const ir = (delta: number) => {
    setDescanso(null)
    setAtual((a) => Math.min(passos.length - 1, Math.max(0, a + delta)))
  }
  return {
    passos,
    atual,
    passo: passos[atual],
    marcadas,
    descanso,
    fecharDescanso: () => setDescanso(null),
    tocarSerie,
    anterior: () => ir(-1),
    proximo: () => ir(1),
    ultimo: atual === passos.length - 1,
    concluido,
    concluir: () => setConcluido(true),
  }
}
