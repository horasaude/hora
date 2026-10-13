import { describe, expect, it } from 'vitest'
import { lerPedido } from './validar'

describe('lerPedido', () => {
  it('aceita convite e limpa os campos', () => {
    expect(
      lerPedido({
        acao: 'convidar',
        nome: ' Laís ',
        email: ' LAIS@Exemplo.com ',
        especialidade: 'treino',
        titulo: '',
      }),
    ).toEqual({
      acao: 'convidar',
      nome: 'Laís',
      email: 'lais@exemplo.com',
      especialidade: 'treino',
      titulo: null,
      senha: null,
    })
  })
  it('cadastro com senha de 8 a 72 caracteres', () => {
    const base = { acao: 'convidar', nome: 'Ana', email: 'a@b.co' }
    expect(lerPedido({ ...base, senha: 'segredo123' })).toMatchObject({ senha: 'segredo123' })
    expect(lerPedido({ ...base, senha: 'curta' })).toBeNull()
    expect(lerPedido({ ...base, senha: 'x'.repeat(73) })).toBeNull()
  })
  it('definir senha pede id válido e senha de 8 caracteres', () => {
    const id = '00000000-0000-0000-0000-000000000002'
    expect(lerPedido({ acao: 'senha', perfil: id, senha: 'segredo123' })).toEqual({
      acao: 'senha',
      perfil: id,
      senha: 'segredo123',
    })
    expect(lerPedido({ acao: 'senha', perfil: id, senha: '1234567' })).toBeNull()
    expect(lerPedido({ acao: 'senha', perfil: 'x', senha: 'segredo123' })).toBeNull()
  })
  it('especialidade vazia vira null', () => {
    expect(
      lerPedido({ acao: 'convidar', nome: 'Ana', email: 'a@b.co', especialidade: '' }),
    ).toMatchObject({
      especialidade: null,
    })
  })
  it('recusa e-mail, nome, especialidade e ação inválidos', () => {
    expect(lerPedido({ acao: 'convidar', nome: 'Ana', email: 'sem-arroba' })).toBeNull()
    expect(lerPedido({ acao: 'convidar', nome: '', email: 'a@b.co' })).toBeNull()
    expect(
      lerPedido({ acao: 'convidar', nome: 'Ana', email: 'a@b.co', especialidade: 'vendas' }),
    ).toBeNull()
    expect(lerPedido({ acao: 'apagar' })).toBeNull()
    expect(lerPedido(null)).toBeNull()
  })
  it('link pede um id válido', () => {
    const id = '00000000-0000-0000-0000-000000000002'
    expect(lerPedido({ acao: 'link', perfil: id })).toEqual({ acao: 'link', perfil: id })
    expect(lerPedido({ acao: 'link', perfil: 'x' })).toBeNull()
  })
})
