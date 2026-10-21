// Quanto da aula a aluna realmente assistiu: só conta o trecho tocado em sequência.
// Pular para a frente (ou voltar) não soma; rever o mesmo trecho não conta duas vezes.

/** Trecho assistido, em segundos: [início, fim]. */
export type Trecho = [number, number]

/** ultimoEm: hora (ms) da última leitura, para comparar o avanço do vídeo com o tempo que passou de verdade. */
export type Acompanhamento = { trechos: Trecho[]; ultimo: number | null; ultimoEm?: number }

/** Maior avanço entre duas leituras que ainda conta como assistido (leitura a cada 1 s, até 2x). */
export const AVANCO_MAXIMO = 3
/** Velocidade mais rápida do player: o vídeo não anda mais que 2x o tempo do relógio sem ser pulo. */
export const VELOCIDADE_MAXIMA = 2
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

/** Quanto o vídeo pode andar entre duas leituras sem ser pulo. No celular, em tela cheia, o navegador
 * espaça as leituras (às vezes dezenas de segundos): vale o tempo que passou no relógio, até 2x. */
function avancoPermitido(a: Acompanhamento, agora?: number): number {
  if (agora === undefined || a.ultimoEm === undefined) return AVANCO_MAXIMO
  const passou = Math.max(0, agora - a.ultimoEm) / 1000
  return Math.max(AVANCO_MAXIMO, passou * VELOCIDADE_MAXIMA + 1)
}

/** Leitura do tempo do vídeo enquanto toca (agora: hora da leitura em ms). */
export function registrarTempo(a: Acompanhamento, tempo: number, agora?: number): Acompanhamento {
  if (!Number.isFinite(tempo) || tempo < 0) return a
  if (a.ultimo === null) return { ...a, ultimo: tempo, ultimoEm: agora }
  const avanco = tempo - a.ultimo
  if (avanco > 0 && avanco <= avancoPermitido(a, agora))
    return { trechos: juntarTrecho(a.trechos, [a.ultimo, tempo]), ultimo: tempo, ultimoEm: agora }
  return { ...a, ultimo: tempo, ultimoEm: agora }
}

/** Pausa, fim ou pulo: a próxima leitura recomeça a contar dali. */
export const pausar = (a: Acompanhamento): Acompanhamento => ({
  trechos: a.trechos,
  ultimo: null,
})

/** Junta os trechos guardados no banco aos já contados nesta tela (nenhum apaga o outro). */
export const juntarTrechos = (a: Trecho[], b: Trecho[]): Trecho[] =>
  b.reduce<Trecho[]>((acc, t) => juntarTrecho(acc, t), a)

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
