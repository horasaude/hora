import { describe, expect, it } from 'vitest'
import { esquemaAula, esquemaAulaAte, esquemaAviso } from './formularios'

const aula = {
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
    expect(esquemaAulaAte(7).safeParse({ ...aula, dia: '7' }).success).toBe(true)
    expect(esquemaAulaAte(7).safeParse({ ...aula, dia: '8' }).success).toBe(false)
  })

  it('link do vídeo precisa ser https', () => {
    expect(esquemaAula.safeParse({ ...aula, video_url: 'http://x.com' }).success).toBe(false)
  })

  it('aviso guarda o horário de Brasília em UTC', () => {
    const r = esquemaAviso.parse({ titulo: 'Oi', texto: 'Texto', publicar_em: '2026-10-24T19:00' })
    expect(r.publicar_em).toBe('2026-10-24T22:00:00.000Z')
  })
})
