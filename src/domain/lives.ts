// Lives: a janela de entrar (30 minutos antes até o fim) e a contagem regressiva.
// O banco confere a mesma janela ao dar os pontos (entrar_live).

export const ABRE_ANTES_MIN = 30
const MIN = 60_000

export type Janela = 'antes' | 'aberta' | 'encerrada'

export function janelaDaLive(inicio: Date, duracaoMin: number, agora: Date): Janela {
  const abre = inicio.getTime() - ABRE_ANTES_MIN * MIN
  const fecha = inicio.getTime() + duracaoMin * MIN
  const t = agora.getTime()
  if (t < abre) return 'antes'
  if (t > fecha) return 'encerrada'
  return 'aberta'
}

export type Contagem = { dias: number; horas: number; minutos: number }

/** Quanto falta para o início (zero quando já começou). */
export function contagem(inicio: Date, agora: Date): Contagem {
  const total = Math.max(0, Math.floor((inicio.getTime() - agora.getTime()) / MIN))
  return {
    dias: Math.floor(total / 1440),
    horas: Math.floor((total % 1440) / 60),
    minutos: total % 60,
  }
}

export const PROFISSIONAIS = {
  ana: { nome: 'Ana Milhomem', foto: '/fotos/ana.webp' },
  clara: { nome: 'Dra. Clara Maria', foto: '/fotos/clara.webp' },
  lais: { nome: 'Laís Moraes', foto: '/fotos/lais.webp' },
} as const

export type Profissional = keyof typeof PROFISSIONAIS
