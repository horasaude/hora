import { describe, expect, it } from 'vitest'
import { esquemaAula, esquemaAulaPara, esquemaAviso, esquemaNovoTema } from './formularios'

const aula = {
  tema: 'tema-1',
  etapa: 'etapa-1',
  titulo: 'Boas-vindas',
  descricao: '',
  video_url: 'https://youtu.be/dQw4w9WgXcQ',
  profissional: '',
  duracao: '',
  dia: '1',
}

describe('formulários do painel', () => {
  it('o dia de liberação vira número e começa no 1', () => {
    expect(esquemaAula.parse({ ...aula, dia: '15' }).dia_liberacao).toBe(15)
    expect(esquemaAula.safeParse({ ...aula, dia: '0' }).success).toBe(false)
  })

  it('na preparação o dia vai de 1 a 7', () => {
    const prep = esquemaAulaPara(['tema-1'])
    expect(prep.safeParse({ ...aula, dia: '7' }).success).toBe(true)
    expect(prep.safeParse({ ...aula, dia: '8' }).success).toBe(false)
    expect(prep.safeParse({ ...aula, tema: 'outro', dia: '8' }).success).toBe(true)
  })

  it('aula precisa de tema e etapa, e a etapa vira etapa_id', () => {
    expect(esquemaAula.safeParse({ ...aula, etapa: '' }).success).toBe(false)
    expect(esquemaAula.parse(aula)).toMatchObject({ etapa_id: 'etapa-1' })
    expect(esquemaAula.parse(aula)).not.toHaveProperty('tema')
  })

  it('tema novo: cor da lista e ordem de 1 a 99', () => {
    const tema = { titulo: 'Sono', descricao: 'Durma melhor', cor: 'lilas', ordem: '3' }
    expect(esquemaNovoTema.parse(tema)).toMatchObject({ cor: 'lilas', ordem: 3 })
    expect(esquemaNovoTema.safeParse({ ...tema, cor: 'roxo' }).success).toBe(false)
    expect(esquemaNovoTema.safeParse({ ...tema, ordem: '0' }).success).toBe(false)
  })

  it('link do vídeo precisa ser https', () => {
    expect(esquemaAula.safeParse({ ...aula, video_url: 'http://x.com' }).success).toBe(false)
  })

  it('aviso guarda o horário de Brasília em UTC', () => {
    const r = esquemaAviso.parse({ titulo: 'Oi', texto: 'Texto', publicar_em: '2026-10-24T19:00' })
    expect(r.publicar_em).toBe('2026-10-24T22:00:00.000Z')
  })
})
