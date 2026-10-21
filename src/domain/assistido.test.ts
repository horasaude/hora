import { describe, expect, it } from 'vitest'
import {
  assistiuOSuficiente,
  juntarTrechos,
  lerTrechos,
  pausar,
  pontoDeRetomada,
  registrarTempo,
  segundosAssistidos,
  type Acompanhamento,
} from './assistido'

const inicio: Acompanhamento = { trechos: [], ultimo: null }
/** Toca de `de` até `ate`, lendo o tempo a cada segundo. */
function tocar(a: Acompanhamento, de: number, ate: number): Acompanhamento {
  let x = registrarTempo(a, de)
  for (let s = de + 1; s <= ate; s++) x = registrarTempo(x, s)
  return pausar(x)
}

describe('tempo assistido', () => {
  it('assistir em sequência conta cada segundo', () => {
    expect(segundosAssistidos(tocar(inicio, 0, 60).trechos)).toBe(60)
  })

  it('pular para o fim não conta', () => {
    let a = tocar(inicio, 0, 10)
    a = registrarTempo(a, 10)
    a = registrarTempo(a, 595)
    a = tocar(a, 595, 600)
    expect(segundosAssistidos(a.trechos)).toBe(15)
    expect(assistiuOSuficiente(a.trechos, 600)).toBe(false)
  })

  it('rever o mesmo trecho não soma duas vezes', () => {
    const a = tocar(tocar(inicio, 0, 100), 50, 100)
    expect(segundosAssistidos(a.trechos)).toBe(100)
  })

  it('pausar e voltar depois não conta o intervalo', () => {
    const a = tocar(tocar(inicio, 0, 30), 31, 60)
    expect(segundosAssistidos(a.trechos)).toBe(59)
  })

  it('90% do vídeo assistido conclui; 89% não', () => {
    expect(assistiuOSuficiente(tocar(inicio, 0, 540).trechos, 600)).toBe(true)
    expect(assistiuOSuficiente(tocar(inicio, 0, 534).trechos, 600)).toBe(false)
  })

  it('assistir até o fim, em partes, conclui', () => {
    const a = tocar(tocar(inicio, 0, 300), 300, 600)
    expect(assistiuOSuficiente(a.trechos, 600)).toBe(true)
  })

  it('velocidade 2x ainda conta; salto maior não', () => {
    let a = registrarTempo(inicio, 0)
    a = registrarTempo(a, 2)
    a = registrarTempo(a, 4)
    expect(segundosAssistidos(a.trechos)).toBe(4)
    a = registrarTempo(a, 30)
    expect(segundosAssistidos(a.trechos)).toBe(4)
  })

  it('celular em tela cheia: leituras espaçadas contam pelo tempo do relógio', () => {
    let a = registrarTempo(inicio, 0, 0)
    a = registrarTempo(a, 40, 40_000)
    a = registrarTempo(a, 119, 119_500)
    expect(segundosAssistidos(a.trechos)).toBe(119)
  })

  it('com o relógio, pulo para a frente continua não contando', () => {
    let a = registrarTempo(inicio, 0, 0)
    a = registrarTempo(a, 1, 1000)
    a = registrarTempo(a, 100, 2000)
    expect(segundosAssistidos(a.trechos)).toBe(1)
  })

  it('o progresso do banco soma ao que já foi contado na tela', () => {
    expect(juntarTrechos([[100, 112]], [[0, 50]])).toEqual([
      [0, 50],
      [100, 112],
    ])
  })

  it('sem duração conhecida não conclui', () => {
    expect(assistiuOSuficiente([[0, 100]], 0)).toBe(false)
  })
})

describe('progresso guardado', () => {
  it('lê só trechos válidos e junta os sobrepostos', () => {
    expect(lerTrechos([[0, 10], [5, 20], ['x', 1], [30, 20], null])).toEqual([[0, 20]])
    expect(lerTrechos('lixo')).toEqual([])
  })

  it('retoma de onde parou, com folga; perto do fim ou no começo, do zero', () => {
    expect(pontoDeRetomada(200, 600)).toBe(197)
    expect(pontoDeRetomada(5, 600)).toBe(0)
    expect(pontoDeRetomada(590, 600)).toBe(0)
  })
})
