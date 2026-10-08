import { describe, expect, it } from 'vitest'
import { boasVindas, textoDaCompra } from './boasVindas.ts'

const base = {
  site: 'https://comunidadeora.com.br',
  app: 'https://app.comunidadeora.com.br',
  nome: 'Maria <b>Silva</b>',
  email: 'maria@teste.com',
  whatsapp: 'https://wa.me/5598999999999',
  link: 'https://x.supabase.co/auth/v1/verify?token=abc&type=recovery',
}

describe('e-mail de pagamento confirmado', () => {
  const { assunto, html } = boasVindas({
    ...base,
    compra: { plano: 'parcelado', valorCentavos: 237600, parcelas: 12, meses: 13 },
  })

  it('confirma o pagamento com o resumo da compra', () => {
    expect(assunto).toBe('Pagamento confirmado: seu acesso ao ORA está liberado')
    expect(html).toContain('12x de R$ 198,00 no cartão')
    expect(html).toContain('13 meses de acesso')
  })

  it('traz plataforma, usuário e o botão de criar a senha', () => {
    expect(html).toContain('app.comunidadeora.com.br')
    expect(html).toContain('Usuário: <strong>maria@teste.com</strong>')
    expect(html).toContain('Criar minha senha')
    expect(html).toContain('token=abc&amp;type=recovery')
  })

  it('ensina a instalar no iPhone e no Android', () => {
    expect(html).toContain('Adicionar à Tela de Início')
    expect(html).toContain('Instalar app')
  })

  it('escapa o nome e não usa travessão', () => {
    expect(html).toContain('Oi, Maria')
    expect(html).not.toContain('<b>')
    expect(html).not.toContain('—')
  })

  it('texto de cada plano', () => {
    expect(textoDaCompra({ plano: 'pix', valorCentavos: 199700, parcelas: 1, meses: 13 })).toBe(
      'R$ 1.997,00 à vista no Pix',
    )
    expect(
      textoDaCompra({ plano: 'recorrente', valorCentavos: 21500, parcelas: 12, meses: 12 }),
    ).toBe('R$ 215,00 por mês, no cartão')
  })
})
