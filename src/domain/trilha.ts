// Trilha da aluna: preparação (dias 1 a 7), escolha do tema (dia 8) e etapas do tema.
// Quem libera aula e etapa é o banco (trilha_aluna, aula_liberada); aqui só se lê o que veio.

export type AulaTrilha = {
  id: string
  titulo: string
  profissional: string | null
  duracao_minutos: number | null
  dia_liberacao: number
  ordem: number
  liberada: boolean
  concluida: boolean
}

export type EtapaTrilha = {
  id: string
  chave: string | null
  titulo: string
  ordem: number
  iniciada_em: string | null
  dia_na_etapa: number | null
  aulas: AulaTrilha[]
}

export type TemaOpcao = { id: string; chave: string | null; titulo: string; frase: string }

export type Trilha = {
  dia: number | null
  tema_atual: string | null
  temas: TemaOpcao[]
  preparacao: AulaTrilha[]
  etapas: EtapaTrilha[]
}

export const DIAS_DE_PREPARACAO = 7
export const DIA_DA_ESCOLHA = 8
export const DIAS_DA_ETAPA = 30
export const PCT_PARA_AVANCAR = 80

/** Primeira aula liberada e não concluída; se todas estão feitas, a última liberada. */
export function aulaDeHoje(aulas: AulaTrilha[]): AulaTrilha | null {
  const liberadas = aulas.filter((a) => a.liberada)
  return liberadas.find((a) => !a.concluida) ?? liberadas.at(-1) ?? null
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

/** Dias que faltam para a escolha do tema (0 quando já pode escolher). */
export const diasParaEscolha = (dia: number) => Math.max(0, DIA_DA_ESCOLHA - dia)

/** No dia 8 em diante, sem tema escolhido, ela precisa escolher. */
export const precisaEscolherTema = (t: Pick<Trilha, 'dia' | 'tema_atual'>) =>
  t.dia !== null && t.dia >= DIA_DA_ESCOLHA && !t.tema_atual

export type Condicoes = {
  aulasOk: boolean
  diasOk: boolean
  pode: boolean
  faltamAulas: number
  dia: number
}

/** Próxima etapa abre com 80% das aulas concluídas E 30 dias desde o início da etapa (igual ao banco). */
export function condicoesDaEtapa(total: number, concluidas: number, diaNaEtapa: number): Condicoes {
  const aulasOk = total > 0 && concluidas * 10 >= total * 8
  const diasOk = diaNaEtapa >= DIAS_DA_ETAPA
  const faltamAulas = Math.max(0, Math.ceil((total * PCT_PARA_AVANCAR) / 100) - concluidas)
  return { aulasOk, diasOk, pode: aulasOk && diasOk, faltamAulas, dia: diaNaEtapa }
}

/** Etapa em andamento: a última já iniciada. */
export const etapaAtual = (etapas: EtapaTrilha[]) =>
  [...etapas].reverse().find((e) => e.iniciada_em !== null) ?? null

/** Etapa anterior de uma etapa bloqueada (a que precisa cumprir as condições). */
export const etapaAnterior = (etapas: EtapaTrilha[], etapa: EtapaTrilha) =>
  etapas.filter((e) => e.ordem < etapa.ordem).at(-1) ?? null

/** Dias que faltam para uma aula abrir dentro da etapa. */
export const faltamDias = (aula: AulaTrilha, diaNaEtapa: number | null) =>
  Math.max(0, aula.dia_liberacao - (diaNaEtapa ?? 0))

/** Aulas em andamento: as da etapa atual do tema ou, antes do tema, as da preparação. */
export const aulasEmAndamento = (t: Trilha) =>
  t.tema_atual ? (etapaAtual(t.etapas)?.aulas ?? []) : t.preparacao

/** Aulas da mesma lista (preparação ou etapa) de uma aula. */
export function aulasDaMesmaLista(trilha: Trilha | undefined, id: string): AulaTrilha[] {
  if (!trilha) return []
  if (trilha.preparacao.some((a) => a.id === id)) return trilha.preparacao
  return trilha.etapas.find((e) => e.aulas.some((a) => a.id === id))?.aulas ?? []
}
