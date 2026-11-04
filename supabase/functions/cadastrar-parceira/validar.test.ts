import { describe, expect, it } from 'vitest'
import { lerPedido } from './validar'

describe('lerPedido da parceira', () => {
  it('aceita o cadastro e limpa nome e e-mail', () => {
    expect(
      lerPedido({ acao: 'cadastrar', nome: ' Bia Lima ', email: ' BIA@Exemplo.com ', meses: 3 }),
    ).toEqual({ acao: 'cadastrar', nome: 'Bia Lima', email: 'bia@exemplo.com', meses: 3 })
  })
  it('prazo só 1, 3, 6 ou 12 meses', () => {
    const base = { acao: 'cadastrar', nome: 'Bia', email: 'b@c.co' }
    for (const meses of [1, 3, 6, 12]) expect(lerPedido({ ...base, meses })).not.toBeNull()
    for (const meses of [0, 2, 24, '3', null]) expect(lerPedido({ ...base, meses })).toBeNull()
  })
  it('recusa nome vazio, e-mail inválido e ação desconhecida', () => {
    expect(lerPedido({ acao: 'cadastrar', nome: '', email: 'b@c.co', meses: 3 })).toBeNull()
    expect(lerPedido({ acao: 'cadastrar', nome: 'Bia', email: 'sem-arroba', meses: 3 })).toBeNull()
    expect(lerPedido({ acao: 'apagar' })).toBeNull()
    expect(lerPedido(null)).toBeNull()
  })
  it('reenviar pede um id válido', () => {
    const id = '00000000-0000-0000-0000-000000000002'
    expect(lerPedido({ acao: 'reenviar', perfil: id })).toEqual({ acao: 'reenviar', perfil: id })
    expect(lerPedido({ acao: 'reenviar', perfil: 'x' })).toBeNull()
  })
})
