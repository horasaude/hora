import { describe, expect, it } from 'vitest'
import { esquemaAula, esquemaAviso, liberacaoDoDia } from './formularios'

const aula = {
  titulo: 'Boas-vindas',
  descricao: '',
  video_url: 'https://youtu.be/dQw4w9WgXcQ',
  material_url: '',
  profissional: '',
  duracao: '',
  liberacao: 'compra' as const,
  dia: '',
}

describe('formulários do painel', () => {
  it('liberada na compra vira dia 1 e depois de 7 dias vira dia 8', () => {
    expect(esquemaAula.parse(aula).dia_liberacao).toBe(1)
    expect(esquemaAula.parse({ ...aula, liberacao: 'sete' }).dia_liberacao).toBe(8)
    expect(esquemaAula.parse({ ...aula, liberacao: 'outro', dia: '15' }).dia_liberacao).toBe(15)
  })

  it('outro dia precisa ser 1 em diante; material vazio vira null', () => {
    expect(esquemaAula.safeParse({ ...aula, liberacao: 'outro', dia: '0' }).success).toBe(false)
    expect(esquemaAula.parse(aula).material_url).toBeNull()
  })

  it('link do vídeo precisa ser https', () => {
    expect(esquemaAula.safeParse({ ...aula, video_url: 'http://x.com' }).success).toBe(false)
  })

  it('volta do banco para o formulário', () => {
    expect(liberacaoDoDia(1).liberacao).toBe('compra')
    expect(liberacaoDoDia(8).liberacao).toBe('sete')
    expect(liberacaoDoDia(3)).toEqual({ liberacao: 'outro', dia: '3' })
  })

  it('aviso guarda o horário de Brasília em UTC', () => {
    const r = esquemaAviso.parse({ titulo: 'Oi', texto: 'Texto', publicar_em: '2026-10-24T19:00' })
    expect(r.publicar_em).toBe('2026-10-24T22:00:00.000Z')
  })
})
