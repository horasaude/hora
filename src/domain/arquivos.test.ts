import { describe, expect, it } from 'vitest'
import { formatarTamanho, nomeSemExtensao, validarArquivo } from './arquivos'

const MB = 1024 * 1024
const arquivo = (name: string, type: string, size: number) => ({ name, type, size })

describe('validação de arquivo', () => {
  it('material aceita PDF, JPG, PNG e WEBP até 20 MB', () => {
    expect(validarArquivo(arquivo('a.pdf', 'application/pdf', 3 * MB), 'material')).toEqual({
      ok: true,
      tipo: 'pdf',
    })
    expect(validarArquivo(arquivo('a.png', 'image/png', 20 * MB), 'material')).toEqual({
      ok: true,
      tipo: 'imagem',
    })
    expect(validarArquivo(arquivo('a.webp', 'image/webp', 1), 'material')).toEqual({
      ok: true,
      tipo: 'imagem',
    })
  })
})

describe('validação de arquivo: Word', () => {
  it('material aceita Word (.doc e .docx) até 20 MB; capa não', () => {
    const docx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    expect(validarArquivo(arquivo('a.docx', docx, 20 * MB), 'material')).toEqual({
      ok: true,
      tipo: 'word',
    })
    expect(validarArquivo(arquivo('a.doc', 'application/msword', MB), 'material')).toEqual({
      ok: true,
      tipo: 'word',
    })
    expect(validarArquivo(arquivo('a.docx', '', MB), 'material')).toEqual({
      ok: true,
      tipo: 'word',
    })
    expect(validarArquivo(arquivo('a.docx', docx, 20 * MB + 1), 'material')).toEqual({
      ok: false,
      motivo: 'tamanho',
    })
    expect(validarArquivo(arquivo('a.docx', docx, MB), 'capa')).toEqual({
      ok: false,
      motivo: 'tipo',
    })
  })
})

describe('validação de arquivo: recusas', () => {
  it('recusa outro tipo, arquivo vazio e acima do limite', () => {
    expect(validarArquivo(arquivo('a.xlsx', 'application/vnd.ms-excel', MB), 'material')).toEqual({
      ok: false,
      motivo: 'tipo',
    })
    expect(validarArquivo(arquivo('a.gif', 'image/gif', MB), 'material')).toEqual({
      ok: false,
      motivo: 'tipo',
    })
    expect(validarArquivo(arquivo('a.pdf', 'application/pdf', 20 * MB + 1), 'material')).toEqual({
      ok: false,
      motivo: 'tamanho',
    })
    expect(validarArquivo(arquivo('a.pdf', 'application/pdf', 0), 'material')).toEqual({
      ok: false,
      motivo: 'vazio',
    })
  })
  it('sem tipo informado, vale a extensão', () => {
    expect(validarArquivo(arquivo('Apostila.PDF', '', MB), 'material')).toEqual({
      ok: true,
      tipo: 'pdf',
    })
  })
  it('capa aceita só imagem até 5 MB', () => {
    expect(validarArquivo(arquivo('c.jpg', 'image/jpeg', 5 * MB), 'capa').ok).toBe(true)
    expect(validarArquivo(arquivo('c.jpg', 'image/jpeg', 5 * MB + 1), 'capa')).toEqual({
      ok: false,
      motivo: 'tamanho',
    })
    expect(validarArquivo(arquivo('c.pdf', 'application/pdf', MB), 'capa')).toEqual({
      ok: false,
      motivo: 'tipo',
    })
  })
  it('imagem do exercício aceita GIF até 5 MB; capa e material não', () => {
    expect(validarArquivo(arquivo('agachamento.gif', 'image/gif', MB), 'exercicio')).toEqual({
      ok: true,
      tipo: 'imagem',
    })
    expect(validarArquivo(arquivo('a.gif', '', MB), 'exercicio').ok).toBe(true)
    expect(validarArquivo(arquivo('a.gif', 'image/gif', 5 * MB + 1), 'exercicio')).toEqual({
      ok: false,
      motivo: 'tamanho',
    })
    expect(validarArquivo(arquivo('a.gif', 'image/gif', MB), 'capa').ok).toBe(false)
    expect(validarArquivo(arquivo('a.gif', 'image/gif', MB), 'material').ok).toBe(false)
  })
  it('tamanho e nome legíveis', () => {
    expect(formatarTamanho(850 * 1024)).toBe('850 KB')
    expect(formatarTamanho(2.4 * MB)).toBe('2,4 MB')
    expect(nomeSemExtensao('Lista de compras.pdf')).toBe('Lista de compras')
  })
})
