import { describe, expect, it } from 'vitest'
import { prepararCadastro } from './validar'

const agora = new Date('2026-10-05T12:00:00Z')
const valido = {
  nome: '  Maria Silva ',
  email: 'Maria@Teste.com',
  whatsapp: '(98) 98765-4321',
  plano: 'parcelado',
  aceite: true,
  versaoTermos: 'v1',
  origem: 'https://instagram.com/',
  utm: { source: 'instagram', campaign: 'ora' },
  site: '',
}

describe('prepararCadastro', () => {
  it('limpa os dados e usa o horário do servidor no aceite', () => {
    const r = prepararCadastro(valido, agora)
    expect(r).toEqual({
      tipo: 'ok',
      linha: {
        nome: 'Maria Silva',
        email: 'maria@teste.com',
        whatsapp: '98987654321',
        plano_escolhido: 'parcelado',
        aceitou_termos_em: '2026-10-05T12:00:00.000Z',
        versao_termos: 'v1',
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
    expect(prepararCadastro(semExtras, agora).tipo).toBe('ok')
  })

  it('honeypot preenchido é robô, mesmo com o resto válido', () => {
    expect(prepararCadastro({ ...valido, site: 'http://spam' }, agora)).toEqual({ tipo: 'robo' })
  })

  it.each([
    ['sem aceite', { aceite: false }],
    ['plano desconhecido', { plano: 'anual' }],
    ['e-mail inválido', { email: 'maria@' }],
    ['WhatsApp curto', { whatsapp: '9898' }],
    ['nome vazio', { nome: ' ' }],
    ['UTM gigante', { utm: { source: 'x'.repeat(201) } }],
  ])('recusa %s', (_, troca) => {
    expect(prepararCadastro({ ...valido, ...troca }, agora)).toEqual({ tipo: 'invalido' })
  })

  it('recusa corpo que não é objeto', () => {
    expect(prepararCadastro('oi', agora)).toEqual({ tipo: 'invalido' })
    expect(prepararCadastro(null, agora)).toEqual({ tipo: 'invalido' })
  })
})
