// Regras do módulo de Treinos: nomes das opções, treino de hoje pela rotina e progresso das séries.

export const GRUPOS = {
  peito: 'Peito',
  costas: 'Costas',
  ombro: 'Ombro',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  abdomen: 'Abdômen',
  gluteo: 'Glúteo',
  quadriceps: 'Quadríceps',
  posterior: 'Posterior',
  panturrilha: 'Panturrilha',
  corpo_todo: 'Corpo todo',
  cardio: 'Cardio',
  mobilidade: 'Mobilidade',
} as const

export const EQUIPAMENTOS = {
  sem: 'Sem equipamento',
  halter: 'Halter',
  elastico: 'Elástico',
  barra: 'Barra',
  maquina: 'Máquina',
  banco: 'Banco',
  outro: 'Outro',
} as const

export const NIVEIS = {
  adaptacao: 'Adaptação',
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
} as const
export const LOCAIS = { casa: 'Casa', academia: 'Academia' } as const

export const OBJETIVOS = {
  hipertrofia: 'Hipertrofia',
  reducao_gordura: 'Redução de gordura',
  reducao_hipertrofia: 'Redução de gordura e hipertrofia',
  definicao: 'Definição muscular',
  condicionamento: 'Condicionamento físico',
  qualidade_vida: 'Qualidade de vida',
} as const

/** Rotina por dia da semana ou numérica (Treino 1, 2, 3 na ordem, sem dia fixo). */
export const TIPOS_ROTINA = {
  semana: 'Dia da semana',
  numerico: 'Numérico (Treino 1, 2, 3)',
} as const

/** Domingo é 0, como no Date. */
export const DIAS_SEMANA = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const
export const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const

export type Grupo = keyof typeof GRUPOS
export type Equipamento = keyof typeof EQUIPAMENTOS
export type Nivel = keyof typeof NIVEIS
export type Local = keyof typeof LOCAIS

/** "Iniciante · Casa". */
export const nivelLocal = (nivel: string, local: string) =>
  `${NIVEIS[nivel as Nivel] ?? nivel} · ${LOCAIS[local as Local] ?? local}`

/** Dia da semana em Brasília (UTC-3, sem horário de verão). */
export function diaDaSemanaBrasilia(agora: Date): number {
  return new Date(agora.getTime() - 3 * 3_600_000).getUTCDay()
}

export type DiaDaRotina<T> = { dia_semana: number; treino: T }

/** Treino de hoje pela rotina; sem treino hoje, o próximo da semana (dia de descanso). */
export function treinoDeHoje<T>(
  rotina: DiaDaRotina<T>[],
  dia: number,
): { hoje: DiaDaRotina<T> | null; proximo: DiaDaRotina<T> | null } {
  const hoje = rotina.find((r) => r.dia_semana === dia) ?? null
  if (hoje) return { hoje, proximo: null }
  const ordenada = [...rotina].sort(
    (a, b) => ((a.dia_semana - dia + 7) % 7) - ((b.dia_semana - dia + 7) % 7),
  )
  return { hoje: null, proximo: ordenada[0] ?? null }
}

/** Datas (aaaa-mm-dd) de domingo a sábado da semana de hoje em Brasília. */
export function semanaDe(agora: Date): string[] {
  const local = new Date(agora.getTime() - 3 * 3_600_000)
  const domingo = new Date(local.getTime() - local.getUTCDay() * 86_400_000)
  return Array.from({ length: 7 }, (_, i) =>
    new Date(domingo.getTime() + i * 86_400_000).toISOString().slice(0, 10),
  )
}

/** Séries marcadas por exercício (índice do exercício como chave, como no banco). */
export type SeriesMarcadas = Record<string, number>

export function progressoDoTreino(marcadas: SeriesMarcadas, series: number[]): number {
  const total = series.reduce((s, n) => s + n, 0)
  if (total === 0) return 0
  const feitas = series.reduce((s, n, i) => s + Math.min(n, marcadas[String(i)] ?? 0), 0)
  return Math.round((feitas / total) * 100)
}
