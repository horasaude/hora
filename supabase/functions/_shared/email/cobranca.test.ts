import { describe, expect, it } from 'vitest'
import { emailCobranca } from './cobranca.ts'

const base = {
  site: 'https://ora.t',
  nome: 'Maria Silva',
  whatsapp: 'https://wa.me/5511999999999',
  link: 'https://www.asaas.com/i/abc',
  pausaEm: '30/10/2026',
}

describe('régua da mensalidade', () => {
  it('lembrete e véspera dizem a data da pausa e levam para a fatura', () => {
    for (const etapa of ['lembrete', 'vespera'] as const) {
      const e = emailCobranca(etapa, base)
      expect(e.html).toContain('30/10/2026')
      expect(e.html).toContain('https://www.asaas.com/i/abc')
      expect(e.html).toContain('Oi, Maria!')
    }
  })

  it('pausado avisa que o acesso volta ao pagar', () => {
    const e = emailCobranca('pausado', base)
    expect(e.assunto).toBe('Seu acesso ao ORA foi pausado')
    expect(e.html).toContain('volta na hora')
  })
})
