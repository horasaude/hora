import { describe, expect, it } from 'vitest'
import { abreEm, aulaDeHoje, progresso, semanaDoAcesso, temaAtual, type AulaTrilha } from './trilha'

const aula = (id: string, extra: Partial<AulaTrilha> = {}): AulaTrilha => ({
  id,
  tema_id: 't1',
  tema_titulo: 'Comece por aqui',
  etapa_id: 'e1',
  etapa_titulo: 'Arrancada',
  titulo: `Aula ${id}`,
  profissional: 'Ana',
  duracao_minutos: 8,
  dia_liberacao: 1,
  liberada: true,
  concluida: false,
  ...extra,
})

describe('aulaDeHoje', () => {
  it('é a primeira liberada que falta concluir', () => {
    const lista = [aula('a', { concluida: true }), aula('b'), aula('c')]
    expect(aulaDeHoje(lista)?.id).toBe('b')
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

describe('temaAtual', () => {
  it('usa o tema e a etapa da aula de hoje e agrupa as etapas na ordem', () => {
    const lista = [
      aula('a', { concluida: true }),
      aula('b', { etapa_id: 'e2', etapa_titulo: 'Constância' }),
      aula('c', { tema_id: 't2', tema_titulo: 'Outro', etapa_id: 'e3', liberada: false }),
    ]
    const tema = temaAtual(lista)
    expect(tema?.titulo).toBe('Comece por aqui')
    expect(tema?.etapaAtual).toBe('e2')
    expect(tema?.etapas.map((e) => e.titulo)).toEqual(['Arrancada', 'Constância'])
  })
  it('sem aulas, não há tema', () => {
    expect(temaAtual([])).toBeNull()
  })
})

describe('progresso, semana e abertura', () => {
  it('progresso arredonda a porcentagem de concluídas', () => {
    expect(progresso([aula('a', { concluida: true }), aula('b'), aula('c')])).toBe(33)
    expect(progresso([])).toBe(0)
  })
  it('dias 1 a 7 são a semana 1, dia 8 abre a semana 2', () => {
    expect(semanaDoAcesso(1)).toBe(1)
    expect(semanaDoAcesso(7)).toBe(1)
    expect(semanaDoAcesso(8)).toBe(2)
  })
  it('aula do dia 8 abre 7 x 24 h depois do início, como no banco', () => {
    const inicio = new Date('2026-10-06T14:30:00Z')
    expect(abreEm(inicio, 1).toISOString()).toBe('2026-10-06T14:30:00.000Z')
    expect(abreEm(inicio, 8).toISOString()).toBe('2026-10-13T14:30:00.000Z')
  })
})
