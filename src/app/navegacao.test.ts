import { describe, expect, it } from 'vitest'
import { secaoAtiva, telaAtiva } from './navegacao'

describe('navegação da aluna', () => {
  it('agrupa as rotas atuais nas 5 abas', () => {
    expect(secaoAtiva('/app')?.id).toBe('inicio')
    expect(secaoAtiva('/app/trilha/aula/x')?.id).toBe('trilhas')
    expect(secaoAtiva('/app/aula/x')?.id).toBe('trilhas')
    expect(secaoAtiva('/app/cardapios/1/compras')?.id).toBe('trilhas')
    expect(secaoAtiva('/app/ranking')?.id).toBe('desafios')
    expect(secaoAtiva('/app/forum/abc')?.id).toBe('comunidade')
    expect(secaoAtiva('/app/loja')?.id).toBe('comunidade')
    expect(secaoAtiva('/app/perfil/conta')?.id).toBe('perfil')
  })
  it('a tela mais específica vence', () => {
    expect(telaAtiva('/app/perfil')?.nome).toBe('Minha evolução')
    expect(telaAtiva('/app/perfil/conta')?.nome).toBe('Minha conta')
    expect(telaAtiva('/app/trilha/aula/1')?.nome).toBe('Temas')
  })
  it('o painel não é tela da aluna', () => {
    expect(secaoAtiva('/app/admin/conteudo')).toBeNull()
  })
})
