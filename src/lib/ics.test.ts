import { describe, expect, it } from 'vitest'
import { gerarIcs } from './ics'

describe('gerarIcs', () => {
  it('monta o evento em UTC com lembrete de 1 hora', () => {
    const ics = gerarIcs(
      {
        uid: 'live1',
        titulo: 'Live: Sono, fome',
        inicio: new Date('2026-10-23T19:00:00-03:00'),
        fim: new Date('2026-10-23T20:00:00-03:00'),
        url: 'https://sala.t',
      },
      new Date('2026-10-01T00:00:00Z'),
    )
    expect(ics).toContain('DTSTART:20261023T220000Z')
    expect(ics).toContain('DTEND:20261023T230000Z')
    expect(ics).toContain('SUMMARY:Live: Sono\\, fome')
    expect(ics).toContain('TRIGGER:-PT1H')
  })
})
