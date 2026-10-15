// Anamnese: perguntas criadas no painel (texto, sim ou não, escolha) e as respostas da aluna.

export const TIPOS_PERGUNTA = {
  texto: 'Resposta escrita',
  sim_nao: 'Sim ou não',
  escolha: 'Escolha entre opções',
} as const

export type TipoPergunta = keyof typeof TIPOS_PERGUNTA
export type Pergunta = {
  id: string
  texto: string
  tipo: TipoPergunta
  opcoes: string[]
  obrigatoria: boolean
}
export type Respostas = Record<string, string>

const ehPergunta = (x: unknown): x is Pergunta => {
  const p = x as Pergunta
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof p.id === 'string' &&
    typeof p.texto === 'string' &&
    p.tipo in TIPOS_PERGUNTA
  )
}

/** Perguntas guardadas no banco (jsonb) em formato seguro. */
export function lerPerguntas(json: unknown): Pergunta[] {
  if (!Array.isArray(json)) return []
  return json.filter(ehPergunta).map((p) => ({
    ...p,
    opcoes: Array.isArray(p.opcoes) ? p.opcoes.filter((o) => typeof o === 'string') : [],
    obrigatoria: Boolean(p.obrigatoria),
  }))
}

export function lerRespostas(json: unknown): Respostas {
  if (typeof json !== 'object' || json === null || Array.isArray(json)) return {}
  return Object.fromEntries(
    Object.entries(json).filter((e): e is [string, string] => typeof e[1] === 'string'),
  )
}

export const respondida = (p: Pergunta, r: Respostas) => (r[p.id] ?? '').trim() !== ''

/** Obrigatórias ainda sem resposta (o Enviar só libera sem nenhuma). */
export const faltando = (perguntas: Pergunta[], r: Respostas) =>
  perguntas.filter((p) => p.obrigatoria && !respondida(p, r))

export function progresso(perguntas: Pergunta[], r: Respostas): number {
  if (perguntas.length === 0) return 0
  return Math.round((perguntas.filter((p) => respondida(p, r)).length / perguntas.length) * 100)
}

/** Resposta como a equipe lê: sim e não por extenso, vazio vira traço. */
export function textoResposta(p: Pergunta, r: Respostas): string {
  const v = (r[p.id] ?? '').trim()
  if (!v) return '-'
  if (p.tipo === 'sim_nao') return v === 'sim' ? 'Sim' : 'Não'
  return v
}

export const novaPergunta = (): Pergunta => ({
  id: crypto.randomUUID().slice(0, 8),
  texto: '',
  tipo: 'texto',
  opcoes: [],
  obrigatoria: false,
})

/** Erros de uma pergunta antes de salvar (iguais às regras do banco). */
export function erroPergunta(p: Pergunta): 'texto' | 'opcoes' | null {
  if (p.texto.trim().length < 2 || p.texto.length > 300) return 'texto'
  if (p.tipo === 'escolha' && p.opcoes.filter((o) => o.trim()).length < 2) return 'opcoes'
  return null
}
