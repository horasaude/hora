// Quanto da aula a aluna realmente assistiu: só conta o trecho tocado em sequência.
// Pular para a frente (ou voltar) não soma; rever o mesmo trecho não conta duas vezes.

/** Trecho assistido, em segundos: [início, fim]. */
export type Trecho = [number, number]

export type Acompanhamento = { trechos: Trecho[]; ultimo: number | null }

/** Maior avanço entre duas leituras que ainda conta como assistido (leitura a cada 1 s, até 2x). */
export const AVANCO_MAXIMO = 3
export const PCT_CONCLUIR = 0.9

/** Junta o novo trecho aos já assistidos (sobrepostos ou encostados viram um só). */
export function juntarTrecho(trechos: Trecho[], novo: Trecho): Trecho[] {
  const todos = [...trechos, novo].sort((a, b) => a[0] - b[0])
  const saida: Trecho[] = []
  for (const [ini, fim] of todos) {
    const ultimo = saida.at(-1)
    if (ultimo && ini <= ultimo[1] + 0.5) ultimo[1] = Math.max(ultimo[1], fim)
    else saida.push([ini, fim])
  }
  return saida
}

/** Leitura do tempo do vídeo enquanto toca. */
export function registrarTempo(a: Acompanhamento, tempo: number): Acompanhamento {
  if (!Number.isFinite(tempo) || tempo < 0) return a
  if (a.ultimo === null) return { ...a, ultimo: tempo }
  const avanco = tempo - a.ultimo
  if (avanco > 0 && avanco <= AVANCO_MAXIMO)
    return { trechos: juntarTrecho(a.trechos, [a.ultimo, tempo]), ultimo: tempo }
  return { ...a, ultimo: tempo }
}

/** Pausa, fim ou pulo: a próxima leitura recomeça a contar dali. */
export const pausar = (a: Acompanhamento): Acompanhamento => ({ ...a, ultimo: null })

export const segundosAssistidos = (trechos: Trecho[]): number =>
  trechos.reduce((soma, [ini, fim]) => soma + Math.max(0, fim - ini), 0)

/** Concluída quando o tempo realmente assistido chega a 90% do vídeo. */
export function assistiuOSuficiente(trechos: Trecho[], duracao: number): boolean {
  return duracao > 0 && segundosAssistidos(trechos) >= duracao * PCT_CONCLUIR
}

/** Lê trechos guardados no banco; o que vier fora do formato é ignorado. */
export function lerTrechos(valor: unknown): Trecho[] {
  if (!Array.isArray(valor)) return []
  const validos = valor.filter((t): t is Trecho => {
    if (!Array.isArray(t) || t.length !== 2) return false
    const [ini, fim] = t as unknown[]
    return typeof ini === 'number' && typeof fim === 'number' && fim >= ini
  })
  return validos.reduce<Trecho[]>((acc, [ini, fim]) => juntarTrecho(acc, [ini, fim]), [])
}

/** Onde retomar: a posição guardada, menos uns segundos; perto do fim, recomeça do zero. */
export function pontoDeRetomada(posicao: number, duracao: number): number {
  if (posicao < 10 || (duracao > 0 && posicao > duracao - 15)) return 0
  return Math.floor(posicao - 3)
}
