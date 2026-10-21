import { describe, expect, it } from 'vitest'
import { MENU_LATERAL, secaoAtiva, telaAtiva } from './navegacao'

describe('navegação da aluna', () => {
  it('agrupa as rotas nas 5 abas: tudo do tema fica em Comece aqui', () => {
    expect(secaoAtiva('/app')?.id).toBe('inicio')
    expect(secaoAtiva('/app/trilha/tema/x')?.id).toBe('comece')
    expect(secaoAtiva('/app/trilha/aula/x')?.id).toBe('comece')
    expect(secaoAtiva('/app/cardapios/1/compras')?.id).toBe('comece')
    expect(secaoAtiva('/app/treinos/1')?.id).toBe('comece')
    expect(secaoAtiva('/app/desafios/1')?.id).toBe('comece')
    expect(secaoAtiva('/app/ranking')?.id).toBe('comunidade')
    expect(secaoAtiva('/app/forum/abc')?.id).toBe('comunidade')
    expect(secaoAtiva('/app/loja/x')?.id).toBe('loja')
    expect(secaoAtiva('/app/perfil/conta')?.id).toBe('perfil')
  })
  it('a tela mais específica vence', () => {
    expect(telaAtiva('/app/perfil')?.nome).toBe('Minha evolução')
    expect(telaAtiva('/app/perfil/conta')?.nome).toBe('Minha conta')
    expect(telaAtiva('/app/trilha/aula/1')?.nome).toBe('Comece por aqui')
  })
  it('o painel não é tela da aluna', () => {
    expect(secaoAtiva('/app/admin/conteudo')).toBeNull()
  })
})

describe('menu lateral da aluna', () => {
  it('lista simples, na ordem pedida', () => {
    expect(MENU_LATERAL.map((i) => i.nome)).toEqual([
      'Início',
      'Comece por aqui',
      'Lives',
      'Fórum',
      'Ranking',
      'Loja',
      'Minha evolução',
      'Minha conta',
    ])
  })
  it('o ponto da live fica em Lives', () => {
    expect(MENU_LATERAL.filter((i) => i.live).map((i) => i.nome)).toEqual(['Lives'])
  })
})
