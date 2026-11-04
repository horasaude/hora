import { describe, expect, it } from 'vitest'
import { parceria } from './parceria.ts'

const base = {
  site: 'https://www.comunidadeora.com.br',
  nome: 'Bia <b>Lima</b>',
  email: 'bia@teste.com',
  whatsapp: 'https://wa.me/5534999999999',
  link: 'https://www.comunidadeora.com.br/acesso/abc?x=1&y=2',
}

describe('e-mail da parceira', () => {
  it('diz o prazo, o usuário e traz o botão de criar a senha', () => {
    const { assunto, html } = parceria({ ...base, meses: 3 })
    expect(assunto).toBe('Seu acesso ao ORA está liberado')
    expect(html).toContain('por 3 meses, como nossa parceira')
    expect(html).toContain('Usuário: <strong>bia@teste.com</strong>')
    expect(html).toContain('Criar minha senha')
    expect(html).toContain('acesso/abc?x=1&amp;y=2')
    expect(html).toContain('Adicionar à Tela de Início')
  })

  it('1 mês no singular, nome escapado e sem WhatsApp manda responder o e-mail', () => {
    const { html } = parceria({ ...base, meses: 1, whatsapp: null })
    expect(html).toContain('por 1 mês')
    expect(html).toContain('Oi, Bia!')
    expect(html).not.toContain('<b>')
    expect(html).toContain('responda este e-mail')
  })
})
