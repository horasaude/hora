import { describe, expect, it } from 'vitest'
import { emailConvite, gerarConvite, quandoBrasilia, type Convite } from './conviteLive.ts'

const base: Convite = {
  live: 'abc',
  seq: 1,
  metodo: 'REQUEST',
  tema: 'Sono, fome; e <b>rotina</b>',
  inicio: new Date('2026-10-24T22:00:00Z'),
  minutos: 60,
  para: 'maria@t.com',
  nome: 'Maria Silva',
  organizador: 'contato@comunidadeora.com.br',
  site: 'https://ora.test',
}

describe('convite de agenda da live', () => {
  it('convite novo tem método, sequência, horário e aviso 1 hora antes', () => {
    const ics = gerarConvite(base, new Date('2026-10-20T12:00:00Z'))
    expect(ics).toContain('METHOD:REQUEST')
    expect(ics).toContain('UID:live-abc@comunidadeora.com.br')
    expect(ics).toContain('SEQUENCE:1')
    expect(ics).toContain('DTSTART:20261024T220000Z')
    expect(ics).toContain('DTEND:20261024T230000Z')
    expect(ics).toContain('TRIGGER:-PT1H')
    expect(ics).toContain('SUMMARY:Live ORA: Sono\\, fome\\; e <b>rotina</b>')
  })

  it('leva para Lives no ORA, nunca para a sala', () => {
    const ics = gerarConvite(base)
    expect(ics).toContain('https://ora.test/app/lives')
    expect(ics).not.toMatch(/meet\.google/)
  })

  it('cancelamento sai com status cancelado', () => {
    const ics = gerarConvite({ ...base, metodo: 'CANCEL', seq: 3 })
    expect(ics).toContain('METHOD:CANCEL')
    expect(ics).toContain('STATUS:CANCELLED')
    expect(ics).toContain('SEQUENCE:3')
  })

  it('nenhuma linha passa de 75 caracteres', () => {
    const longo = gerarConvite({ ...base, tema: 'x'.repeat(200) })
    for (const linha of longo.split('\r\n')) expect(linha.length).toBeLessThanOrEqual(75)
  })

  it('data e hora no horário de Brasília', () => {
    expect(quandoBrasilia(new Date('2026-10-24T22:00:00Z'))).toBe('sábado, 24/10 às 19h')
    expect(quandoBrasilia(new Date('2026-10-24T22:30:00Z'))).toBe('sábado, 24/10 às 19h30')
  })

  it('e-mail escapa o tema e anexa o convite', () => {
    const e = emailConvite(base)
    expect(e.assunto).toBe('Live marcada: Sono, fome; e <b>rotina</b>')
    expect(e.html).not.toContain('<b>rotina</b>')
    expect(e.html).toContain('Maria')
    expect(e.anexos?.[0]?.tipo).toContain('method=REQUEST')
  })

  it('assunto muda na atualização e no cancelamento', () => {
    expect(emailConvite({ ...base, seq: 2 }).assunto).toMatch(/^Live atualizada/)
    expect(emailConvite({ ...base, metodo: 'CANCEL' }).assunto).toMatch(/^Live cancelada/)
  })
})
