import { describe, expect, it } from 'vitest'
import { prepararCadastro } from './validar'

const valido = {
  nome: '  Maria Silva ',
  email: 'Maria@Teste.com',
  whatsapp: '(98) 98765-4321',
  plano: 'parcelado',
  origem: 'https://instagram.com/',
  utm: { source: 'instagram', campaign: 'ora' },
  site: '',
}

describe('prepararCadastro', () => {
  it('limpa os dados', () => {
    const r = prepararCadastro(valido)
    expect(r).toEqual({
      tipo: 'ok',
      linha: {
        nome: 'Maria Silva',
        email: 'maria@teste.com',
        whatsapp: '98987654321',
        plano_escolhido: 'parcelado',
        origem: 'https://instagram.com/',
        utm_source: 'instagram',
        utm_medium: null,
        utm_campaign: 'ora',
        utm_content: null,
        utm_term: null,
      },
    })
  })

  it('aceita cadastro sem UTM e sem origem', () => {
    const { utm: _u, origem: _o, ...semExtras } = valido
    expect(prepararCadastro(semExtras).tipo).toBe('ok')
  })

  it('honeypot preenchido é robô, mesmo com o resto válido', () => {
    expect(prepararCadastro({ ...valido, site: 'http://spam' })).toEqual({ tipo: 'robo' })
  })

  it.each([
    ['plano desconhecido', { plano: 'anual' }],
    ['e-mail inválido', { email: 'maria@' }],
    ['WhatsApp curto', { whatsapp: '9898' }],
    ['nome vazio', { nome: ' ' }],
    ['UTM gigante', { utm: { source: 'x'.repeat(201) } }],
  ])('recusa %s', (_, troca) => {
    expect(prepararCadastro({ ...valido, ...troca })).toEqual({ tipo: 'invalido' })
  })

  it('ignora campos de contrato enviados pela página antiga', () => {
    const r = prepararCadastro({ ...valido, aceite: true, versaoTermos: 'v1' })
    expect(r.tipo).toBe('ok')
    expect(r.tipo === 'ok' && Object.keys(r.linha)).not.toContain('versao_termos')
  })

  it('recusa corpo que não é objeto', () => {
    expect(prepararCadastro('oi')).toEqual({ tipo: 'invalido' })
    expect(prepararCadastro(null)).toEqual({ tipo: 'invalido' })
  })
})
