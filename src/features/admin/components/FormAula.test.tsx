import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { Tema } from '../api/conteudo.api'
import { FormAula, type EntradaAula } from './FormAula'

const tema = (id: string, titulo: string) => ({ id, titulo, tipo: 'tema' }) as Tema
const TEMAS = [tema('detox', 'Detox'), tema('ema', 'Emagrecimento')]

const VAZIA: EntradaAula = {
  tema: '',
  titulo: '',
  descricao: '',
  video_url: '',
  profissional: '',
  duracao: '',
  liberacao: { modo: 'aberta', quando: '' },
}

function abrir(
  inicial: Partial<EntradaAula> = {},
  aoSalvar = vi.fn().mockResolvedValue(undefined),
) {
  render(
    <FormAula
      titulo="Nova aula"
      temas={TEMAS}
      inicial={{ ...VAZIA, ...inicial }}
      aoSalvar={aoSalvar}
      aoCancelar={vi.fn()}
    />,
  )
  return aoSalvar
}

function preencher() {
  fireEvent.input(screen.getByLabelText('Título da aula'), { target: { value: 'Treino 1' } })
  fireEvent.input(screen.getByLabelText('Vídeo do YouTube'), {
    target: { value: 'https://youtu.be/dQw4w9WgXcQ' },
  })
}

describe('FormAula', () => {
  afterEach(cleanup)

  it('colar o link mostra a prévia do vídeo', async () => {
    abrir()
    fireEvent.input(screen.getByLabelText('Vídeo do YouTube'), {
      target: { value: 'https://youtu.be/dQw4w9WgXcQ' },
    })
    expect(await screen.findByTitle('Prévia do vídeo')).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    )
  })

  it('a aula pede só o tema (abre junto com ele)', () => {
    abrir()
    const opcoes = [...screen.getByLabelText<HTMLSelectElement>('Tema').options].map((o) => o.text)
    expect(opcoes).toEqual(['Escolha o tema', 'Detox', 'Emagrecimento'])
    expect(screen.queryByLabelText('Etapa')).not.toBeInTheDocument()
  })

  it('Salvar rascunho guarda no tema escolhido, sem publicar', async () => {
    const aoSalvar = abrir({ tema: 'ema' })
    preencher()
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }))
    await vi.waitFor(() => expect(aoSalvar).toHaveBeenCalled())
    expect(aoSalvar.mock.calls[0]?.[0]).toMatchObject({ titulo: 'Treino 1', tema: 'ema' })
    expect(aoSalvar.mock.calls[0]?.[1]).toBe(false)
  })

  it('Publicar salva já publicada', async () => {
    const aoSalvar = abrir({ tema: 'ema' })
    preencher()
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))
    await vi.waitFor(() => expect(aoSalvar).toHaveBeenCalled())
    expect(aoSalvar.mock.calls[0]?.[1]).toBe(true)
  })

  it('sem tema escolhido não salva', async () => {
    const aoSalvar = abrir()
    preencher()
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))
    expect(await screen.findByText('Escolha o tema')).toBeInTheDocument()
    expect(aoSalvar).not.toHaveBeenCalled()
  })
})

describe('FormAula: liberação', () => {
  afterEach(cleanup)

  it('Em breve salva bloqueada e Liberar em pede a data e guarda no horário de Brasília', async () => {
    const aoSalvar = abrir({ tema: 'ema' })
    preencher()
    fireEvent.click(screen.getByRole('button', { name: 'Liberar em' }))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }))
    expect(await screen.findByText('Escolha a data e a hora.')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Data e hora'), {
      target: { value: '2026-11-03T19:00' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }))
    await vi.waitFor(() => expect(aoSalvar).toHaveBeenCalledTimes(1))
    expect(aoSalvar.mock.calls[0]?.[0]).toMatchObject({
      bloqueado: false,
      libera_em: '2026-11-03T22:00:00.000Z',
    })
    fireEvent.click(screen.getByRole('button', { name: 'Em breve' }))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }))
    await vi.waitFor(() => expect(aoSalvar).toHaveBeenCalledTimes(2))
    expect(aoSalvar.mock.calls[1]?.[0]).toMatchObject({ bloqueado: true, libera_em: null })
  })
})
