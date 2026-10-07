// Engajamento da aluna: sequência de dias, ranking, progresso de desafio e gráfico da evolução.
// Quem dá ponto e decide o dia é o banco; aqui só se organiza o que veio (datas AAAA-MM-DD de Brasília).

const DIA_MS = 86_400_000

/** Soma n dias a uma data AAAA-MM-DD, sem passar por fuso. */
export function somarDias(data: string, n: number): string {
  return new Date(Date.parse(`${data}T00:00:00Z`) + n * DIA_MS).toISOString().slice(0, 10)
}

/** Dias entre duas datas AAAA-MM-DD (b - a). */
export function diasEntre(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DIA_MS)
}

/** Dias seguidos com check-in até hoje; se hoje ainda não teve, conta até ontem. */
export function diasSeguidos(dias: string[], hoje: string): number {
  const feitos = new Set(dias)
  let dia = feitos.has(hoje) ? hoje : somarDias(hoje, -1)
  let total = 0
  while (feitos.has(dia)) {
    total++
    dia = somarDias(dia, -1)
  }
  return total
}

/** Os últimos 7 dias, do mais antigo a hoje: true quando teve check-in. */
export function ultimosSeteDias(dias: string[], hoje: string): boolean[] {
  const feitos = new Set(dias)
  return Array.from({ length: 7 }, (_, i) => feitos.has(somarDias(hoje, i - 6)))
}

export type LinhaRanking = { posicao: number; apelido: string; pontos: number; eu: boolean }

/** Pontos que faltam para passar quem está logo acima; null se ela é a primeira ou não está na lista. */
export function faltaParaSubir(lista: LinhaRanking[]): number | null {
  const eu = lista.find((l) => l.eu)
  const acima = eu && lista.find((l) => l.posicao === eu.posicao - 1)
  if (!eu || !acima) return null
  return acima.pontos - eu.pontos + 1
}

/** Tom do círculo da posição: 1º dourado, 2º prata, 3º coral, demais cinza. */
export function tomDaPosicao(posicao: number): 'dourado' | 'prata' | 'coral' | 'cinza' {
  return posicao === 1 ? 'dourado' : posicao === 2 ? 'prata' : posicao === 3 ? 'coral' : 'cinza'
}

/** Todos os dias do desafio, do início ao fim. */
export function diasDoDesafio(inicio: string, fim: string): string[] {
  return Array.from({ length: diasEntre(inicio, fim) + 1 }, (_, i) => somarDias(inicio, i))
}

/** Em que dia do desafio estamos (1 = primeiro), limitado ao período. */
export function diaDoDesafio(inicio: string, fim: string, hoje: string): number {
  const total = diasEntre(inicio, fim) + 1
  return Math.max(1, Math.min(total, diasEntre(inicio, hoje) + 1))
}

/** Porcentagem da meta (0 a 100). */
export function progressoMeta(feitos: number, meta: number): number {
  if (meta <= 0) return 0
  return Math.min(100, Math.round((feitos / meta) * 100))
}

/** Dia do desafio já em vigor (ainda não acabou e já começou). */
export function desafioEmAndamento(
  d: { inicio: string; fim: string; encerrado: boolean },
  hoje: string,
) {
  return !d.encerrado && d.inicio <= hoje && hoje <= d.fim
}

export type PontoGrafico = { x: number; y: number }

/** Coordenadas do gráfico de linha (valores na ordem das datas), com margem para não colar nas bordas. */
export function pontosDoGrafico(valores: number[], largura: number, altura: number, margem = 8) {
  if (valores.length === 0) return []
  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const faixa = max - min || 1
  const passo = valores.length > 1 ? (largura - margem * 2) / (valores.length - 1) : 0
  return valores.map<PontoGrafico>((v, i) => ({
    x: Math.round((valores.length > 1 ? margem + i * passo : largura / 2) * 10) / 10,
    y: Math.round((altura - margem - ((v - min) / faixa) * (altura - margem * 2)) * 10) / 10,
  }))
}
