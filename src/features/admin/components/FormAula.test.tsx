import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { FormAula, type EntradaAula } from './FormAula'

const VAZIA: EntradaAula = {
  titulo: '',
  descricao: '',
  video_url: '',
  material_url: '',
  profissional: '',
  duracao: '',
  liberacao: 'compra',
  dia: '1',
}

describe('FormAula', () => {
  afterEach(cleanup)

  it('colar o link mostra a prévia do vídeo', async () => {
    render(<FormAula titulo="Nova aula" inicial={VAZIA} aoSalvar={vi.fn()} aoCancelar={vi.fn()} />)
    fireEvent.input(screen.getByLabelText('Link do vídeo'), {
      target: { value: 'https://youtu.be/dQw4w9WgXcQ' },
    })
    expect(await screen.findByTitle('Prévia do vídeo')).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    )
  })

  it('"Outro dia" mostra o campo do dia; "Depois de 7 dias" salva como dia 8', async () => {
    const aoSalvar = vi.fn().mockResolvedValue(undefined)
    render(<FormAula titulo="Nova aula" inicial={VAZIA} aoSalvar={aoSalvar} aoCancelar={vi.fn()} />)
    expect(screen.queryByLabelText('Dia de liberação')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'Outro dia' }))
    expect(await screen.findByLabelText('Dia de liberação')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'Depois de 7 dias' }))
    fireEvent.input(screen.getByLabelText('Título da aula'), { target: { value: 'Treino 1' } })
    fireEvent.input(screen.getByLabelText('Link do vídeo'), {
      target: { value: 'https://youtu.be/dQw4w9WgXcQ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    await vi.waitFor(() => expect(aoSalvar).toHaveBeenCalled())
    expect(aoSalvar.mock.calls[0]?.[0]).toMatchObject({
      titulo: 'Treino 1',
      dia_liberacao: 8,
      material_url: null,
    })
  })
})
