import { describe, expect, it } from 'vitest'
import { escolherGravacao, reunioesDaLive } from './gravacao.ts'

const g = (file: string, ini: string, fim: string, state = 'FILE_GENERATED') => ({
  state,
  startTime: ini,
  endTime: fim,
  driveDestination: { file },
})

describe('gravação da live', () => {
  it('fica com a gravação pronta mais longa', () => {
    expect(
      escolherGravacao([
        g('curta', '2026-10-24T19:00:00Z', '2026-10-24T19:05:00Z'),
        g('longa', '2026-10-24T19:06:00Z', '2026-10-24T20:00:00Z'),
        g('processando', '2026-10-24T18:00:00Z', '2026-10-24T21:00:00Z', 'STARTED'),
      ]),
    ).toBe('longa')
  })

  it('sem gravação pronta, espera a próxima rodada', () => {
    expect(escolherGravacao([])).toBeNull()
    expect(escolherGravacao([g('x', 'a', 'b', 'ENDED')])).toBeNull()
  })

  it('usa só reuniões encerradas a partir de 1 hora antes da live', () => {
    const lista = [
      {
        name: 'teste-de-ontem',
        startTime: '2026-10-23T19:00:00Z',
        endTime: '2026-10-23T19:10:00Z',
      },
      { name: 'live', startTime: '2026-10-24T18:55:00Z', endTime: '2026-10-24T20:00:00Z' },
      { name: 'ainda-aberta', startTime: '2026-10-24T20:10:00Z' },
    ]
    expect(reunioesDaLive(lista, '2026-10-24T19:00:00Z').map((r) => r.name)).toEqual(['live'])
  })
})
