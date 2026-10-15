import { describe, expect, it } from 'vitest'
import {
  erroPergunta,
  faltando,
  lerPerguntas,
  lerRespostas,
  progresso,
  textoResposta,
  type Pergunta,
} from './anamnese'

const p = (x: Partial<Pergunta>): Pergunta => ({
  id: 'a',
  texto: 'Treina hoje?',
  tipo: 'sim_nao',
  opcoes: [],
  obrigatoria: true,
  ...x,
})

describe('lerPerguntas e lerRespostas', () => {
  it('descarta o que não é pergunta ou resposta de texto', () => {
    expect(lerPerguntas([p({}), { id: 'x', texto: 'y', tipo: 'nota' }, null])).toHaveLength(1)
    expect(lerPerguntas('nada')).toEqual([])
    expect(lerRespostas({ a: 'sim', b: 3 })).toEqual({ a: 'sim' })
    expect(lerRespostas([1])).toEqual({})
  })
})

describe('faltando e progresso', () => {
  const perguntas = [p({}), p({ id: 'b', tipo: 'texto', obrigatoria: false })]
  it('só obrigatória sem resposta falta; espaço não conta', () => {
    expect(faltando(perguntas, { a: '  ' }).map((x) => x.id)).toEqual(['a'])
    expect(faltando(perguntas, { a: 'nao' })).toEqual([])
  })
  it('progresso pelas respondidas', () => {
    expect(progresso(perguntas, { a: 'sim' })).toBe(50)
    expect(progresso([], {})).toBe(0)
  })
})

describe('textoResposta', () => {
  it('sim e não por extenso; vazio vira traço', () => {
    expect(textoResposta(p({}), { a: 'sim' })).toBe('Sim')
    expect(textoResposta(p({}), { a: 'nao' })).toBe('Não')
    expect(textoResposta(p({ tipo: 'texto' }), {})).toBe('-')
  })
})

describe('erroPergunta', () => {
  it('texto curto e escolha com menos de duas opções', () => {
    expect(erroPergunta(p({ texto: 'a' }))).toBe('texto')
    expect(erroPergunta(p({ tipo: 'escolha', opcoes: ['Uma', ' '] }))).toBe('opcoes')
    expect(erroPergunta(p({ tipo: 'escolha', opcoes: ['Uma', 'Duas'] }))).toBeNull()
  })
})
