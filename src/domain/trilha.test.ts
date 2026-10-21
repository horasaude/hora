import { describe, expect, it } from 'vitest'
import {
  aulaDeHoje,
  aulaParaContinuar,
  aulasDaMesmaLista,
  diasParaAbrir,
  progresso,
  proximoTema,
  semanaDoAcesso,
  temaAtual,
  type AulaTrilha,
  type TemaTrilha,
} from './trilha'

const aula = (id: string, extra: Partial<AulaTrilha> = {}): AulaTrilha => ({
  id,
  titulo: `Aula ${id}`,
  profissional: 'Ana',
  duracao_minutos: 8,
  dia_liberacao: 1,
  ordem: 0,
  liberada: true,
  concluida: false,
  ...extra,
})

const tema = (id: string, inicio: number, extra: Partial<TemaTrilha> = {}): TemaTrilha => ({
  id,
  chave: null,
  cor: null,
  titulo: id,
  frase: '',
  inicio,
  dias: 30,
  aberto: false,
  em_breve: false,
  aulas: [],
  ...extra,
})

describe('aulaDeHoje', () => {
  it('é a primeira liberada que falta concluir', () => {
    expect(aulaDeHoje([aula('a', { concluida: true }), aula('b'), aula('c')])?.id).toBe('b')
  })
  it('com tudo concluído, fica na última liberada', () => {
    const lista = [
      aula('a', { concluida: true }),
      aula('b', { concluida: true }),
      aula('c', { liberada: false }),
    ]
    expect(aulaDeHoje(lista)?.id).toBe('b')
  })
  it('sem aula liberada, não há aula de hoje', () => {
    expect(aulaDeHoje([aula('a', { liberada: false })])).toBeNull()
  })
})

describe('temas em sequência', () => {
  const trilha = {
    dia: 10,
    temas: [
      tema('detox', 1, { aberto: true, dias: 7, aulas: [aula('d1')] }),
      tema('emagrecer', 8, { aberto: true, aulas: [aula('e1')] }),
      tema('composicao', 38),
      tema('menopausa', 68, { em_breve: true }),
    ],
  }
  it('o tema do momento é o último aberto', () => {
    expect(temaAtual(trilha)?.id).toBe('emagrecer')
  })
  it('o próximo é o primeiro fechado pela data', () => {
    expect(proximoTema(trilha)?.id).toBe('composicao')
  })
  it('conta os dias para abrir', () => {
    expect(diasParaAbrir({ inicio: 38 }, 10)).toBe(28)
    expect(diasParaAbrir({ inicio: 8 }, 10)).toBe(0)
  })
  it('a aula navega dentro do próprio tema', () => {
    expect(aulasDaMesmaLista(trilha, 'd1').map((a) => a.id)).toEqual(['d1'])
  })
})

describe('progresso e semana', () => {
  it('porcentagem inteira de aulas concluídas', () => {
    expect(progresso([aula('a', { concluida: true }), aula('b'), aula('c')])).toBe(33)
    expect(progresso([])).toBe(0)
  })
  it('dias 1 a 7 são a semana 1', () => {
    expect([semanaDoAcesso(1), semanaDoAcesso(7), semanaDoAcesso(8)]).toEqual([1, 1, 2])
  })
})

describe('aulaParaContinuar', () => {
  it('tema novo sem aula não esconde a aula pendente do Detox', () => {
    const detox = tema('detox', 1, {
      aberto: true,
      aulas: [aula('a', { concluida: true }), aula('b')],
    })
    const novo = tema('novo', 8, { aberto: true })
    expect(aulaParaContinuar({ temas: [detox, novo] })?.aula.id).toBe('b')
  })
  it('prefere a pendente do tema mais novo', () => {
    const detox = tema('detox', 1, { aberto: true, aulas: [aula('a')] })
    const novo = tema('novo', 8, { aberto: true, aulas: [aula('n')] })
    expect(aulaParaContinuar({ temas: [detox, novo] })?.aula.id).toBe('n')
  })
  it('tudo feito: a última liberada; nada aberto: nada', () => {
    const feito = tema('d', 1, { aberto: true, aulas: [aula('a', { concluida: true })] })
    expect(aulaParaContinuar({ temas: [feito] })?.aula.id).toBe('a')
    expect(aulaParaContinuar({ temas: [tema('x', 1)] })).toBeNull()
  })
})
