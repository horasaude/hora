import { describe, expect, it } from 'vitest'
import { naoRenovar, reembolsoFeito } from './cancelamento.ts'

const base = { site: 'https://ora.test', nome: 'Maria <b>Silva</b>', whatsapp: null }

describe('e-mails do cancelamento', () => {
  it('estorno feito avisa o prazo do banco', () => {
    const e = reembolsoFeito({ ...base, estornado: true })
    expect(e.html).toContain('estorno integral')
    expect(e.html).toContain('Maria')
    expect(e.html).not.toContain('<b>')
  })

  it('estorno pendente diz que a equipe resolve', () => {
    expect(reembolsoFeito({ ...base, estornado: false }).html).toContain('nossa equipe')
  })

  it('não renovar mostra a data do fim', () => {
    expect(naoRenovar({ ...base, fim: '24/10/2027' }).html).toContain('24/10/2027')
  })
})
