import { describe, expect, it } from 'vitest'
import { mensagemDesafio } from './desafio'

describe('mensagemDesafio', () => {
  it('com prêmio, mostra o prêmio e abre o desafio', () => {
    const m = mensagemDesafio('d1', 'Água todo dia', 'Kit ORA')
    expect(m.body).toBe('Água todo dia: faça o check-in e não perca o prêmio (Kit ORA).')
    expect(m.url).toBe('/app/desafios/d1')
  })
  it('sem prêmio escrito, fala do prêmio do mês', () => {
    expect(mensagemDesafio('d1', 'Água', '').body).toBe(
      'Água: faça o check-in e não perca o prêmio do mês.',
    )
  })
})
