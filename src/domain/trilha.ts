// Trilha da aluna: qual aula é a de hoje, em que tema e etapa ela está, progresso e quando cada aula abre.
// A liberação de verdade é do banco (minha_trilha e RLS de aulas); aqui só se organiza o que veio.

export type AulaTrilha = {
  id: string
  tema_id: string
  tema_titulo: string
  etapa_id: string
  etapa_titulo: string
  titulo: string
  profissional: string | null
  duracao_minutos: number | null
  dia_liberacao: number
  liberada: boolean
  concluida: boolean
}

export type EtapaTrilha = { id: string; titulo: string; aulas: AulaTrilha[] }
export type TemaTrilha = { id: string; titulo: string; etapas: EtapaTrilha[]; etapaAtual: string }

const DIA_MS = 86_400_000

/** Dias 1 a 7 são a preparação ("Comece por aqui"). */
export const DIAS_DE_PREPARACAO = 7

/** Primeira aula liberada e não concluída, na ordem da trilha; se todas estão feitas, a última liberada. */
export function aulaDeHoje(aulas: AulaTrilha[]): AulaTrilha | null {
  const liberadas = aulas.filter((a) => a.liberada)
  return liberadas.find((a) => !a.concluida) ?? liberadas.at(-1) ?? null
}

/** Tema e etapa da aula de hoje, com as etapas do tema na ordem em que vieram. */
export function temaAtual(aulas: AulaTrilha[]): TemaTrilha | null {
  const referencia = aulaDeHoje(aulas) ?? aulas[0]
  if (!referencia) return null
  const etapas: EtapaTrilha[] = []
  for (const a of aulas.filter((x) => x.tema_id === referencia.tema_id)) {
    const etapa = etapas.find((e) => e.id === a.etapa_id)
    if (etapa) etapa.aulas.push(a)
    else etapas.push({ id: a.etapa_id, titulo: a.etapa_titulo, aulas: [a] })
  }
  return {
    id: referencia.tema_id,
    titulo: referencia.tema_titulo,
    etapas,
    etapaAtual: referencia.etapa_id,
  }
}

/** Porcentagem de aulas concluídas (0 a 100, inteiro). */
export function progresso(aulas: AulaTrilha[]): number {
  if (aulas.length === 0) return 0
  return Math.round((aulas.filter((a) => a.concluida).length / aulas.length) * 100)
}

/** Semana do acesso: dias 1 a 7 são a semana 1. */
export function semanaDoAcesso(dia: number): number {
  return Math.floor((Math.max(dia, 1) - 1) / 7) + 1
}

/** Instante em que a aula do dia N abre: N - 1 vezes 24 h depois do início do acesso. */
export function abreEm(inicio: Date, dia: number): Date {
  return new Date(inicio.getTime() + (dia - 1) * DIA_MS)
}
