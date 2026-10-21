import { describe, expect, it } from 'vitest'
import { esquemaAula, esquemaAviso, esquemaNome, esquemaNovoTema } from './formularios'

const aula = {
  tema: 'tema-1',
  titulo: 'Boas-vindas',
  descricao: '',
  video_url: 'https://youtu.be/dQw4w9WgXcQ',
  profissional: '',
  duracao: '',
  liberacao: { modo: 'aberta' as const, quando: '' },
}

describe('formulários do painel', () => {
  it('aula precisa do tema e guarda a duração em minutos', () => {
    expect(esquemaAula.safeParse({ ...aula, tema: '' }).success).toBe(false)
    expect(esquemaAula.parse({ ...aula, duracao: '12' })).toMatchObject({
      tema: 'tema-1',
      duracao_minutos: 12,
    })
  })

  it('tema novo: cor da lista e dias de 1 a 365', () => {
    const tema = { titulo: 'Sono', descricao: 'Durma melhor', cor: 'lilas', dias: '30' }
    expect(esquemaNovoTema.parse(tema)).toMatchObject({ cor: 'lilas', dias_liberado: 30 })
    expect(esquemaNovoTema.safeParse({ ...tema, cor: 'roxo' }).success).toBe(false)
    expect(esquemaNovoTema.safeParse({ ...tema, dias: '0' }).success).toBe(false)
  })

  it('link do vídeo precisa ser https', () => {
    expect(esquemaAula.safeParse({ ...aula, video_url: 'http://x.com' }).success).toBe(false)
  })

  it('aviso guarda o horário de Brasília em UTC', () => {
    const r = esquemaAviso.parse({ titulo: 'Oi', texto: 'Texto', publicar_em: '2026-10-24T19:00' })
    expect(r.publicar_em).toBe('2026-10-24T22:00:00.000Z')
  })

  it('tema leva a liberação; etapa sem ela não mexe nas colunas', () => {
    const tema = { titulo: 'Sono', descricao: '' }
    expect(
      esquemaNome.parse({ ...tema, liberacao: { modo: 'data', quando: '2026-11-03T19:00' } }),
    ).toEqual({ ...tema, bloqueado: false, libera_em: '2026-11-03T22:00:00.000Z' })
    expect(
      esquemaNome.safeParse({ ...tema, liberacao: { modo: 'data', quando: '' } }).success,
    ).toBe(false)
    expect(esquemaNome.parse(tema)).toEqual(tema)
  })
})
