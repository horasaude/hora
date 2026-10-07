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

  it('salva o dia de liberação da etapa', async () => {
    const aoSalvar = vi.fn().mockResolvedValue(undefined)
    render(<FormAula titulo="Nova aula" inicial={VAZIA} aoSalvar={aoSalvar} aoCancelar={vi.fn()} />)
    fireEvent.input(screen.getByLabelText('Dia da etapa em que libera'), { target: { value: '8' } })
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

  it('na preparação o dia vai até 7', async () => {
    const aoSalvar = vi.fn()
    render(
      <FormAula
        preparacao
        titulo="Nova aula"
        inicial={VAZIA}
        aoSalvar={aoSalvar}
        aoCancelar={vi.fn()}
      />,
    )
    fireEvent.input(screen.getByLabelText('Dia da preparação (1 a 7)'), { target: { value: '9' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(
      await screen.findByText('Use um dia válido (na preparação, de 1 a 7)'),
    ).toBeInTheDocument()
    expect(aoSalvar).not.toHaveBeenCalled()
  })
})
