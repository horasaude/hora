// Regras do fórum: categorias, especialidade de cada profissional e prazo de resposta.

export const CATEGORIAS = {
  alimentacao: 'Alimentação',
  treino: 'Treino',
  saude: 'Saúde',
  plataforma: 'Plataforma',
  outros: 'Outros',
} as const
export type Categoria = keyof typeof CATEGORIAS

/** Especialidade da profissional (Ana: alimentação, Dra. Clara: saúde, Laís: treino). */
export const ESPECIALIDADES = {
  alimentacao: 'Alimentação',
  saude: 'Saúde',
  treino: 'Treino',
} as const
export type Especialidade = keyof typeof ESPECIALIDADES

export const ehCategoria = (v: string): v is Categoria => v in CATEGORIAS

const HORA = 3_600_000

export type Prazo = { tom: 'verde' | 'dourado' | 'coral'; texto: string }

/** Tempo até o prazo de 72 h: verde com folga, dourado com menos de 12 h, coral vencido. */
export function prazoDaDuvida(prazo: Date, agora: Date): Prazo {
  const ms = prazo.getTime() - agora.getTime()
  if (ms < 0) {
    const h = Math.floor(-ms / HORA)
    return { tom: 'coral', texto: h < 1 ? 'Venceu agora' : `Vencida há ${duracao(h)}` }
  }
  const h = Math.floor(ms / HORA)
  return {
    tom: ms < 12 * HORA ? 'dourado' : 'verde',
    texto: h < 1 ? 'Menos de 1 h' : `Faltam ${duracao(h)}`,
  }
}

function duracao(horas: number) {
  if (horas < 24) return `${horas} h`
  const d = Math.floor(horas / 24)
  const h = horas % 24
  return h ? `${d} d ${h} h` : `${d} d`
}
