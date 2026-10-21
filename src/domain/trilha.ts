// Trilha da aluna: temas em sequência pela data de assinatura (o primeiro, Detox, por 7 dias; os
// seguintes conforme os dias de cada tema). Quem abre tema e aula é o banco (trilha_aluna,
// tema_aberto, aula_liberada); aqui só se lê o que veio.

export type AulaTrilha = {
  id: string
  titulo: string
  profissional: string | null
  duracao_minutos: number | null
  dia_liberacao: number
  ordem: number
  liberada: boolean
  /** Miniatura da aula (espaço público capas); sem ela, a do tema ou um fundo de cor. */
  capa?: string | null
  /** Fechada pelas profissionais (cadeado com "Em breve"). */
  em_breve?: boolean
  concluida: boolean
}

export type TemaTrilha = {
  id: string
  chave: string | null
  /** Cor escolhida no painel; sem ela, vale a cor fixa pela chave. */
  cor: string | null
  titulo: string
  frase: string
  /** Capa do tema (espaço público capas). */
  capa?: string | null
  /** Dia da aluna em que o tema abre e quantos dias ele dura até abrir o próximo. */
  inicio: number
  dias: number
  aberto: boolean
  /** Fechado pelas profissionais: cadeado e "Em breve". */
  em_breve: boolean
  aulas: AulaTrilha[]
}

/** O que os cartões de tema precisam. */
export type TemaOpcao = Pick<TemaTrilha, 'id' | 'chave' | 'cor' | 'titulo' | 'frase' | 'capa'> & {
  em_breve?: boolean
}

export type Trilha = { dia: number | null; temas: TemaTrilha[] }

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

/** Tema do momento: o último que já abriu (os anteriores continuam abertos para rever). */
export const temaAtual = (t: Pick<Trilha, 'temas'>): TemaTrilha | null =>
  t.temas.filter((x) => x.aberto).at(-1) ?? null

/** Próximo tema a abrir pela data (ignora os que estão Em breve). */
export const proximoTema = (t: Trilha): TemaTrilha | null =>
  t.temas.find((x) => !x.aberto && !x.em_breve && x.inicio > (t.dia ?? 0)) ?? null

/** Dias que faltam para o tema abrir (0 quando já abriu pela data). */
export const diasParaAbrir = (tema: Pick<TemaTrilha, 'inicio'>, dia: number) =>
  Math.max(0, tema.inicio - dia)

/** Aulas do tema do momento (para a aula de hoje e o progresso). */
export const aulasEmAndamento = (t: Trilha) => temaAtual(t)?.aulas ?? []

/** Aulas da mesma lista da aula aberta (o tema dela), para navegar entre elas. */
export function aulasDaMesmaLista(trilha: Trilha | undefined, id: string): AulaTrilha[] {
  return trilha?.temas.find((x) => x.aulas.some((a) => a.id === id))?.aulas ?? []
}
