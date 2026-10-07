import { describe, expect, it } from 'vitest'
import {
  aulaDeHoje,
  condicoesDaEtapa,
  diasParaEscolha,
  etapaAtual,
  metaDaEtapa,
  precisaEscolherTema,
  progresso,
  semanaDoAcesso,
  type AulaTrilha,
  type EtapaTrilha,
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

describe('desbloqueio da etapa (80% e 30 dias)', () => {
  it('80% e 30 dias: abre', () => {
    expect(condicoesDaEtapa(15, 12, 30).pode).toBe(true)
  })
  it('80% sem 30 dias: não abre', () => {
    const c = condicoesDaEtapa(15, 12, 18)
    expect([c.aulasOk, c.diasOk, c.pode]).toEqual([true, false, false])
  })
  it('30 dias sem 80%: não abre e diz quantas aulas faltam', () => {
    const c = condicoesDaEtapa(15, 10, 31)
    expect([c.aulasOk, c.diasOk, c.pode, c.faltamAulas]).toEqual([false, true, false, 2])
  })
  it('nenhuma das duas: não abre', () => {
    expect(condicoesDaEtapa(15, 3, 5).pode).toBe(false)
  })
  it('etapa sem aulas nunca abre a próxima', () => {
    expect(condicoesDaEtapa(0, 0, 40).pode).toBe(false)
  })
})

describe('outras regras', () => {
  it('progresso e semana', () => {
    expect(progresso([aula('a', { concluida: true }), aula('b')])).toBe(50)
    expect([1, 7, 8].map(semanaDoAcesso)).toEqual([1, 1, 2])
  })
  it('escolha do tema no dia 8', () => {
    expect(diasParaEscolha(3)).toBe(5)
    expect(precisaEscolherTema({ dia: 7, tema_atual: null })).toBe(false)
    expect(precisaEscolherTema({ dia: 8, tema_atual: null })).toBe(true)
    expect(precisaEscolherTema({ dia: 9, tema_atual: 't' })).toBe(false)
  })
  it('etapa atual é a última iniciada', () => {
    const e = (id: string, iniciada_em: string | null): EtapaTrilha => ({
      id,
      chave: null,
      titulo: id,
      ordem: Number(id),
      iniciada_em,
      dia_na_etapa: null,
      aulas: [],
    })
    expect(etapaAtual([e('1', '2026-10-01'), e('2', '2026-10-31'), e('3', null)])?.id).toBe('2')
  })
})

describe('meta da etapa', () => {
  const etapa = (
    ordem: number,
    titulo: string,
    iniciada: boolean,
    aulas: AulaTrilha[],
    dia: number | null,
  ) => ({
    id: String(ordem),
    chave: null,
    titulo,
    ordem,
    iniciada_em: iniciada ? '2026-10-01' : null,
    dia_na_etapa: dia,
    aulas,
  })
  const dez = (feitas: number) =>
    Array.from({ length: 10 }, (_, i) => aula(String(i), { concluida: i < feitas }))
  it('diz quantas aulas e dias faltam para abrir a próxima', () => {
    expect(
      metaDaEtapa([
        etapa(1, 'Constância', true, dez(0), 8),
        etapa(2, 'Para Sempre', false, [], null),
      ]),
    ).toEqual({
      pct: 0,
      faltamAulas: 8,
      faltamDias: 22,
      proxima: 'Para Sempre',
    })
  })
  it('na última etapa não há próxima', () => {
    expect(metaDaEtapa([etapa(1, 'Para Sempre', true, dez(5), 40)])?.proxima).toBeNull()
  })
})
