import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { Etapa, Tema } from '../api/conteudo.api'
import { FormAula, type EntradaAula } from './FormAula'

const tema = (id: string, titulo: string, tipo = 'tema') => ({ id, titulo, tipo }) as Tema
const etapa = (id: string, tema_id: string, titulo: string) => ({ id, tema_id, titulo }) as Etapa
const TEMAS = [tema('prep', 'Preparação', 'preparacao'), tema('ema', 'Emagrecimento')]
const ETAPAS = [
  etapa('e-prep', 'prep', 'Preparação'),
  etapa('e-arr', 'ema', 'Arrancada'),
  etapa('e-con', 'ema', 'Constância'),
]

const VAZIA: EntradaAula = {
  tema: '',
  etapa: '',
  titulo: '',
  descricao: '',
  video_url: '',
  profissional: '',
  duracao: '',
  dia: '1',
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
      etapas={ETAPAS}
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

  it('começa por onde fica a aula: escolher o tema mostra as etapas dele', () => {
    abrir()
    expect(screen.queryByLabelText('Etapa')).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Tema'), { target: { value: 'ema' } })
    const opcoes = [...screen.getByLabelText<HTMLSelectElement>('Etapa').options].map((o) => o.text)
    expect(opcoes).toEqual(['Escolha a etapa', 'Arrancada', 'Constância'])
  })

  it('na Preparação a etapa some e o dia vai até 7', async () => {
    const aoSalvar = abrir()
    fireEvent.change(screen.getByLabelText('Tema'), { target: { value: 'prep' } })
    expect(screen.queryByLabelText('Etapa')).not.toBeInTheDocument()
    preencher()
    fireEvent.input(screen.getByLabelText('Dia da preparação (1 a 7)'), { target: { value: '9' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }))
    expect(
      await screen.findByText('Use um dia válido (na preparação, de 1 a 7)'),
    ).toBeInTheDocument()
    expect(aoSalvar).not.toHaveBeenCalled()
  })

  it('Salvar rascunho guarda na etapa escolhida, sem publicar', async () => {
    const aoSalvar = abrir({ tema: 'ema', etapa: 'e-con' })
    preencher()
    fireEvent.input(screen.getByLabelText('Dia da etapa em que libera'), { target: { value: '8' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }))
    await vi.waitFor(() => expect(aoSalvar).toHaveBeenCalled())
    expect(aoSalvar.mock.calls[0]?.[0]).toMatchObject({
      titulo: 'Treino 1',
      etapa_id: 'e-con',
      dia_liberacao: 8,
    })
    expect(aoSalvar.mock.calls[0]?.[1]).toBe(false)
  })

  it('Publicar salva já publicada', async () => {
    const aoSalvar = abrir({ tema: 'ema', etapa: 'e-arr' })
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
    const aoSalvar = abrir({ tema: 'ema', etapa: 'e-arr' })
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
