import { describe, expect, it } from 'vitest'
import { proximoDaSequencia, replicarSeries, resumoSeries, seriesDoItem } from './series'

const base = { series: 3, repeticoes: '12', carga: '5 kg', descanso_segundos: 60 }

describe('seriesDoItem', () => {
  it('sem detalhe, repete a mesma série', () => {
    expect(seriesDoItem({ ...base, series_detalhe: [] })).toEqual([
      { repeticoes: '12', carga: '5 kg', descanso_segundos: 60 },
      { repeticoes: '12', carga: '5 kg', descanso_segundos: 60 },
      { repeticoes: '12', carga: '5 kg', descanso_segundos: 60 },
    ])
  })
  it('com detalhe, usa série por série e ignora linha inválida', () => {
    const detalhe = [
      { repeticoes: '15', carga: '', descanso_segundos: 30 },
      { repeticoes: '10', carga: '8 kg', descanso_segundos: 90 },
      { lixo: true },
    ]
    expect(seriesDoItem({ ...base, series_detalhe: detalhe })).toEqual(detalhe.slice(0, 2))
  })
})

describe('resumoSeries', () => {
  it('iguais viram 3 x 12; diferentes viram a lista', () => {
    expect(resumoSeries(seriesDoItem({ ...base, series_detalhe: [] }))).toBe('3 x 12')
    expect(
      resumoSeries([
        { repeticoes: '15', carga: '', descanso_segundos: 30 },
        { repeticoes: '12', carga: '', descanso_segundos: 30 },
      ]),
    ).toBe('15, 12')
  })
})

describe('replicarSeries', () => {
  it('copia a primeira para todas', () => {
    const s = [
      { repeticoes: '15', carga: '2 kg', descanso_segundos: 30 },
      { repeticoes: '8', carga: '', descanso_segundos: 90 },
    ]
    expect(replicarSeries(s)).toEqual([s[0], s[0]])
  })
})

describe('proximoDaSequencia', () => {
  const ordem = ['a', 'b', 'c']
  it('sem treino feito, começa pelo primeiro', () => {
    expect(proximoDaSequencia(ordem, [], '2026-10-16')).toEqual({ indice: 0, feitoHoje: false })
  })
  it('depois do último feito, vem o seguinte e volta ao começo', () => {
    const feitos = [
      { treino_id: 'a', data: '2026-10-13' },
      { treino_id: 'c', data: '2026-10-15' },
    ]
    expect(proximoDaSequencia(ordem, feitos, '2026-10-16')).toEqual({
      indice: 0,
      feitoHoje: false,
    })
    expect(proximoDaSequencia(ordem, feitos.slice(0, 1), '2026-10-16').indice).toBe(1)
  })
  it('feito hoje continua como o de hoje', () => {
    expect(
      proximoDaSequencia(ordem, [{ treino_id: 'b', data: '2026-10-16' }], '2026-10-16'),
    ).toEqual({ indice: 1, feitoHoje: true })
  })
  it('ignora treino fora da rotina', () => {
    expect(
      proximoDaSequencia(ordem, [{ treino_id: 'x', data: '2026-10-15' }], '2026-10-16').indice,
    ).toBe(0)
  })
})
