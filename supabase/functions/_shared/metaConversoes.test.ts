import { describe, expect, it } from 'vitest'
import { eventoCompra } from './metaConversoes'

const compra = {
  pedido: 'pedido-1',
  nome: 'Ana Júlia Souza',
  email: ' Ana@Exemplo.com ',
  whatsapp: '34998333744',
  valorCentavos: 189700,
  plano: 'pix',
  rastreio: { fbp: 'fb.1.1.2', ip: '1.2.3.4', ua: 'Safari' },
  site: 'https://www.comunidadeora.com.br',
  quando: new Date('2026-10-24T12:00:00Z'),
}

describe('eventoCompra', () => {
  it('usa o id do pedido para casar com o evento do navegador e manda o valor em reais', async () => {
    const e = await eventoCompra(compra)
    expect(e.event_id).toBe('pedido-1')
    expect(e.event_time).toBe(1792843200)
    expect(e.custom_data).toEqual({ value: 1897, currency: 'BRL', content_name: 'pix' })
    expect(e.user_data.fbp).toBe('fb.1.1.2')
    expect(e.user_data).not.toHaveProperty('fbc')
  })

  it('nunca manda e-mail, telefone ou nome sem criptografar', async () => {
    const e = await eventoCompra(compra)
    const texto = JSON.stringify(e.user_data)
    expect(texto).not.toMatch(/ana|exemplo|34998333744|souza/i)
    const esperado = await eventoCompra({
      ...compra,
      email: 'ana@exemplo.com',
      whatsapp: '5534998333744',
    })
    expect(e.user_data.em).toEqual(esperado.user_data.em)
    expect(e.user_data.ph).toEqual(esperado.user_data.ph)
  })
})
